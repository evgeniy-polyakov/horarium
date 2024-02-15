import {FileModel} from "@/models/FileModel";
import {MouseEvent, useEffect, useReducer, useRef, useState} from "react";
import {TableCell} from "@/components/TableCell";
import {tableSelectionReducer} from "@/models/TableSelection";
import {parseCSV, stringifyCSV} from "@/models/CSVParser";
import {TableColumnHeader} from "@/components/TableColumnHeader";
import {TableRowHeader} from "@/components/TableRowHeader";
import {TableAllHeader} from "@/components/TableAllHeader";
import {IMenu, Menu} from "@/components/Menu";
import {Cell} from "@/models/Cell";
import {CSV} from "@/models/CSV";
import {TableCellMenuBuilder} from "@/components/TableCellMenuBuilder";

export function TableEditor({file}: {
    file: FileModel
}) {
    const [fileId, setFileId] = useState(-1);
    const csvState = useState<CSV>([]);
    const [csv, setCSV] = csvState;
    const mouseDownState = useState<[...Cell, boolean?]>([-1, -1]);
    const [mouseDown, setMouseDown] = mouseDownState;
    const cellEditState = useState<Cell>([-1, -1]);
    const navKeyDownState = useState<Record<string, number>>({});
    const selectionReducer = useReducer(tableSelectionReducer, {file});
    const [selection, select] = selectionReducer;
    const [contextMenu, setContextMenu] = useState<IMenu>();
    const editor = useRef<HTMLDivElement>(null);
    const menuBuilder = new TableCellMenuBuilder(csvState, cellEditState, selectionReducer);

    useEffect(() => {
        if (mouseDown) {
            window.addEventListener("mouseup", onMouseUp, false);
        }
        return () => {
            window.removeEventListener("mouseup", onMouseUp, false);
        }
    });

    useEffect(() => {
        if (!selection.file.tableSelection.hasFocus()) {
            select({action: "setFocus", rowIndex: 0, cellIndex: 0});
        }
    });

    if (selectionReducer[0].file !== file) {
        setMouseDown([-1, -1]);
        selectionReducer[1]({file: file, action: "update"});
    }

    if (fileId !== file.id) {
        setFileId(file.id);
        parseCSV(file.textContent).then(records => setCSV(records));
    }

    async function storeCSV(csv: CSV) {
        setCSV(csv);
        file.textContent = await stringifyCSV(csv);
    }

    function onMouseUp() {
        setMouseDown([-1, -1]);
    }

    async function onCellEdit(rowIndex: number, cellIndex: number, value: string) {
        csv[rowIndex][cellIndex] = value;
        file.textContent = await stringifyCSV(csv);
    }

    function onCellMenu(event: MouseEvent, rowIndex: number, cellIndex: number) {
        event.preventDefault();
        if (!editor.current) {
            return;
        }
        const b = editor.current.querySelector('table.content')!.getBoundingClientRect();
        const h = (editor.current.querySelector('table.columns') as HTMLElement).offsetHeight;
        const v = editor.current.offsetHeight;
        setContextMenu({
            items: menuBuilder.buildMenu(rowIndex, cellIndex),
            x: event.clientX - (b.x ?? 0),
            y: event.clientY - (b.y ?? 0) + h,
            viewportWidth: b.width,
            viewportHeight: v,
            remove: () => setContextMenu(undefined)
        });
    }

    return (
        <div className="table-editor" ref={editor}>
            {csv.length > 0 && (
                <table className="columns">
                    <thead>
                    <tr>
                        <TableAllHeader csv={csv} selectionReducer={selectionReducer}/>
                        {csv[0].map((cell, cellIndex) =>
                            <TableColumnHeader key={cellIndex} cellIndex={cellIndex} csv={csv} selectionReducer={selectionReducer}
                                               onMenu={event => onCellMenu(event, -1, cellIndex)}/>)}
                    </tr>
                    </thead>
                </table>
            )}
            <table className="content">
                <tbody>
                {csv.map((row, rowIndex) =>
                    <tr key={rowIndex} style={{zIndex: csv.length - rowIndex}}>
                        <TableRowHeader rowIndex={rowIndex} csv={csv} selectionReducer={selectionReducer}
                                        onMenu={event => onCellMenu(event, rowIndex, -1)}/>
                        {
                            row.map((cell, cellIndex) =>
                                <TableCell key={cellIndex} csv={csv} rowIndex={rowIndex} cellIndex={cellIndex} selectionReducer={selectionReducer}
                                           mouseDownState={mouseDownState} cellEditState={cellEditState} navKeyDownState={navKeyDownState}
                                           onEdit={value => onCellEdit(rowIndex, cellIndex, value)}
                                           onMenu={event => onCellMenu(event, rowIndex, cellIndex)}/>)
                        }
                    </tr>
                )}
                </tbody>
            </table>
            {contextMenu && <Menu {...contextMenu}/>}
        </div>
    );
}
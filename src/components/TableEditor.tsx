import {FileModel} from "@/models/FileModel";
import {MouseEvent, useEffect, useReducer, useRef, useState} from "react";
import {TableCell} from "@/components/TableCell";
import {tableSelectionReducer} from "@/models/TableSelection";
import {useStateAccessor} from "@/models/StateAccessor";
import {parseCSV, stringifyCSV} from "@/models/CSVParser";
import {TableColumnHeader} from "@/components/TableColumnHeader";
import {TableRowHeader} from "@/components/TableRowHeader";
import {TableAllHeader} from "@/components/TableAllHeader";
import {IMenu, Menu} from "@/components/Menu";
import {IMenuItem} from "@/components/IMenuItem";
import {EditCellAction, InsertColumnAction, InsertRowAction} from "@/components/TableActions";

export function TableEditor({file}: {
    file: FileModel
}) {
    const [fileId, setFileId] = useState(-1);
    const csvState = useState<string[][]>([]);
    const [csv, setCSV] = csvState;
    const mouseDownState = useState(false);
    const [mouseDown, setMouseDown] = mouseDownState;
    const cellEdit = useStateAccessor<[number, number]>([-1, -1]);
    const selectionReducer = useReducer(tableSelectionReducer, {file});
    const [contextMenu, setContextMenu] = useState<IMenu>();
    const editor = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mouseDown) {
            window.addEventListener("mouseup", onMouseUp, false);
        }
        return () => {
            window.removeEventListener("mouseup", onMouseUp, false);
        }
    }, [mouseDown]);

    if (selectionReducer[0].file !== file) {
        setMouseDown(false);
        selectionReducer[1]({file: file, mode: "update"});
    }

    if (fileId !== file.id) {
        setFileId(file.id);
        parseCSV(file.textContent).then(records => setCSV(records));
    }

    function storeCSV(csv: string[][]) {
        setCSV(csv);
        stringifyCSV(csv, file);
    }

    function onMouseUp() {
        setMouseDown(false);
    }

    function onCellEdit(rowIndex: number, cellIndex: number, value: string) {
        csv[rowIndex][cellIndex] = value;
        stringifyCSV(csv, file);
    }

    function onCellMenu(event: MouseEvent, rowIndex: number, cellIndex: number) {
        event.preventDefault();
        if (!editor.current) {
            return;
        }
        const items: IMenuItem[] = [];
        if (rowIndex >= 0 && cellIndex >= 0) {
            items.push(new EditCellAction(cellEdit, rowIndex, cellIndex));
        }
        if (rowIndex >= 0) {
            items.push(
                new InsertRowAction(csvState, selectionReducer, rowIndex, true),
                new InsertRowAction(csvState, selectionReducer, rowIndex, false),
            );
        }
        if (cellIndex >= 0) {
            items.push(
                new InsertColumnAction(csvState, selectionReducer, cellIndex, true),
                new InsertColumnAction(csvState, selectionReducer, cellIndex, false),
            );
        }
        const b = editor.current.querySelector('table.content')!.getBoundingClientRect();
        const h = (editor.current.querySelector('table.columns') as HTMLElement).offsetHeight;
        const v = editor.current.offsetHeight;
        setContextMenu({
            items: items,
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
                                <TableCell key={cellIndex} csv={csv} rowIndex={rowIndex} cellIndex={cellIndex}
                                           selectionReducer={selectionReducer} mouseDownState={mouseDownState} cellEdit={cellEdit}
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
import {FileModel} from "@/models/FileModel";
import {MouseEvent, useEffect, useReducer, useRef, useState} from "react";
import {TableCell} from "@/components/TableCell";
import {tableSelectionReducer} from "@/models/TableSelection";
import {parseCSV, stringifyCSV} from "@/models/CSVParser";
import {TableColumnHeader} from "@/components/TableColumnHeader";
import {TableRowHeader} from "@/components/TableRowHeader";
import {TableAllHeader} from "@/components/TableAllHeader";
import {IMenu, Menu} from "@/components/Menu";
import {IMenuItem} from "@/components/IMenuItem";
import {ClearCellsAction, CloneColumnAction, CloneRowAction, ColumnMenuGroup, CopyCellsAction, CutCellsAction, DeleteColumnAction, DeleteRowAction, EditCellAction, InsertColumnAction, InsertRowAction, MenuSeparator, MoveColumnAction, MoveRowAction, PasteCellsAction, RowMenuGroup} from "@/components/TableActions";
import {Cell} from "@/models/Cell";
import {CSV} from "@/models/CSV";

export function TableEditor({file}: {
    file: FileModel
}) {
    const [fileId, setFileId] = useState(-1);
    const csvState = useState<CSV>([]);
    const [csv, setCSV] = csvState;
    const mouseDownState = useState<[...Cell, boolean?]>([-1, -1]);
    const [mouseDown, setMouseDown] = mouseDownState;
    const cellEditState = useState<Cell>([-1, -1]);
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

        function getRowItems() {
            return [
                new CloneRowAction(csvState, selectionReducer, rowIndex),
                new InsertRowAction(csvState, selectionReducer, rowIndex, true),
                new InsertRowAction(csvState, selectionReducer, rowIndex, false),
                new MenuSeparator(),
                new MoveRowAction(csvState, selectionReducer, rowIndex, true),
                new MoveRowAction(csvState, selectionReducer, rowIndex, false),
                new MenuSeparator(),
                new DeleteRowAction(csvState, selectionReducer, rowIndex),
            ];
        }

        function getColumnItems() {
            return [
                new CloneColumnAction(csvState, selectionReducer, cellIndex),
                new InsertColumnAction(csvState, selectionReducer, cellIndex, true),
                new InsertColumnAction(csvState, selectionReducer, cellIndex, false),
                new MenuSeparator(),
                new MoveColumnAction(csvState, selectionReducer, cellIndex, true),
                new MoveColumnAction(csvState, selectionReducer, cellIndex, false),
                new MenuSeparator(),
                new DeleteColumnAction(csvState, selectionReducer, cellIndex),
            ];
        }

        const items: IMenuItem[] =
            rowIndex >= 0 && cellIndex >= 0 ? [
                new EditCellAction(cellEditState, rowIndex, cellIndex),
                new MenuSeparator(),
                new CutCellsAction(csvState, selectionReducer, rowIndex, cellIndex),
                new CopyCellsAction(csvState, selectionReducer, rowIndex, cellIndex),
                new PasteCellsAction(csvState, selectionReducer, rowIndex, cellIndex),
                new ClearCellsAction(csvState, selectionReducer, rowIndex, cellIndex),
                new MenuSeparator(),
                new RowMenuGroup(getRowItems()),
                new ColumnMenuGroup(getColumnItems()),
            ] : rowIndex >= 0 ? getRowItems() :
                cellIndex >= 0 ? getColumnItems() : [];
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
                                           selectionReducer={selectionReducer} mouseDownState={mouseDownState} cellEditState={cellEditState}
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
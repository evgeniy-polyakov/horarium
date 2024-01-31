import {MouseEvent} from "react";
import {TableSelectionReducer} from "@/models/TableSelection";

export function TableRowHeader({csv, rowIndex, selectionReducer: [selection, select], onMenu}: {
    csv: string[][],
    rowIndex: number,
    selectionReducer: TableSelectionReducer,
    onMenu?: (event: MouseEvent) => void
}) {

    function onMouseDown(e: MouseEvent) {
        if (e.button !== 0) {
            return;
        }
        const tableSelection = selection.file.tableSelection;
        let focusRow = selection.file.tableSelection.focusRow;
        if (!tableSelection.hasFocus()) {
            select({action: "setFocus", rowIndex, cellIndex: 0});
            focusRow = rowIndex;
        }
        if (e.shiftKey) {
            select({action: "selectRange", startRow: focusRow, startCell: 0, endRow: rowIndex, endCell: csv[rowIndex].length - 1, clear: !e.ctrlKey});
        } else {
            select({action: "setFocus", rowIndex, cellIndex: 0});
            select({action: "selectRange", startRow: rowIndex, startCell: 0, endRow: rowIndex, endCell: csv[rowIndex].length - 1, clear: !e.ctrlKey});
        }
    }

    return (
        <th onMouseDown={onMouseDown} onContextMenu={onMenu}>{rowIndex + 1}</th>
    );
}
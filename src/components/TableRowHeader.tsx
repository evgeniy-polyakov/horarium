import {MouseEvent} from "react";
import {TableSelectionReducer} from "@/models/TableSelection";
import {CSV} from "@/models/CSV";

export function TableRowHeader({csv, rowIndex, selectionReducer: [selection, select], onMenu}: {
    csv: CSV,
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
            select({action: "selectRange", range: [focusRow, 0, rowIndex, csv[rowIndex].length - 1], clear: !e.ctrlKey});
        } else {
            select({action: "setFocus", rowIndex, cellIndex: 0});
            select({action: "selectRange", range: [rowIndex, 0, rowIndex, csv[rowIndex].length - 1], clear: !e.ctrlKey});
        }
    }

    return (
        <th onMouseDown={onMouseDown} onContextMenu={onMenu}>{rowIndex + 1}</th>
    );
}
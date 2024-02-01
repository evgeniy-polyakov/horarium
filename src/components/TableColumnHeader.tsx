import {MouseEvent} from "react";
import {TableSelectionReducer} from "@/models/TableSelection";

export function TableColumnHeader({csv, cellIndex, selectionReducer: [selection, select], onMenu}: {
    csv: string[][],
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onMenu?: (event: MouseEvent) => void
}) {

    function onMouseDown(e: MouseEvent) {
        if (e.button !== 0) {
            return;
        }
        const tableSelection = selection.file.tableSelection;
        let focusCell = selection.file.tableSelection.focusCell;
        if (!tableSelection.hasFocus()) {
            select({action: "setFocus", rowIndex: 0, cellIndex});
            focusCell = cellIndex;
        }
        if (e.shiftKey) {
            select({action: "selectRange", range: [0, focusCell, csv.length - 1, cellIndex], clear: !e.ctrlKey});
        } else {
            select({action: "setFocus", rowIndex: 0, cellIndex});
            select({action: "selectRange", range: [0, cellIndex, csv.length - 1, cellIndex], clear: !e.ctrlKey});
        }
    }

    return (
        <th onMouseDown={onMouseDown} onContextMenu={onMenu}>{getTitle(cellIndex)}</th>
    );
}

function getTitle(cellIndex: number) {
    const startSymbol = "A".charCodeAt(0);
    const endSymbol = "Z".charCodeAt(0);
    const radix = endSymbol - startSymbol + 1;
    let s = String.fromCharCode(startSymbol + cellIndex % radix);
    while (cellIndex >= radix) {
        cellIndex = Math.floor(cellIndex / radix) - 1;
        s = String.fromCharCode(startSymbol + cellIndex % radix) + s;
    }
    return s;
}
import {MouseEvent} from "react";
import {MODE_APPEND, MODE_RANGE, MODE_SELECT, TableSelectionReducer} from "@/models/TableSelection";

export function TableColumnHeader({csv, cellIndex, selectionReducer: [, select], onMenu}: {
    csv: string[][],
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onMenu?: (event: MouseEvent) => void
}) {

    function onMouseDown(e: MouseEvent) {
        // todo allow to select ranges in one call
        select({
            rowIndex: 0,
            cellIndex: cellIndex,
            mode: MODE_SELECT | (e.shiftKey ? MODE_RANGE : 0) | (e.ctrlKey ? MODE_APPEND : 0)
        });
        select({
            rowIndex: csv.length,
            cellIndex: cellIndex,
            mode: MODE_SELECT | MODE_RANGE | (e.ctrlKey ? MODE_APPEND : 0)
        });
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
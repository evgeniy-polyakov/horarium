import {MouseEvent} from "react";
import {MODE_APPEND, MODE_RANGE, MODE_SELECT, TableSelectionReducer} from "@/models/TableSelection";

export function TableColumnHeader({csv, cellIndex, selectionReducer, onMenu}: {
    csv: string[][],
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onMenu?: (event: MouseEvent) => void
}) {

    function onMouseDown(e: MouseEvent) {
        // todo allow to select ranges in one call
        selectionReducer[1]({
            rowIndex: 0,
            cellIndex: cellIndex,
            mode: MODE_SELECT | (e.shiftKey ? MODE_RANGE : 0) | (e.ctrlKey ? MODE_APPEND : 0)
        });
        selectionReducer[1]({
            rowIndex: csv.length,
            cellIndex: cellIndex,
            mode: MODE_SELECT | MODE_RANGE | (e.ctrlKey ? MODE_APPEND : 0)
        });
    }

    return (
        <th onMouseDown={onMouseDown} onContextMenu={onMenu}>{cellIndex >= 0 ? cellIndex + 1 : ""}</th>
    );
}
import {MouseEvent} from "react";
import {MODE_APPEND, MODE_RANGE, MODE_SELECT, TableSelectionReducer} from "@/models/TableSelection";

export function TableRowHeader({csv, rowIndex, selectionReducer: [, select], onMenu}: {
    csv: string[][],
    rowIndex: number,
    selectionReducer: TableSelectionReducer,
    onMenu?: (event: MouseEvent) => void
}) {

    function onMouseDown(e: MouseEvent) {
        // todo allow to select ranges in one call
        select({
            rowIndex: rowIndex,
            cellIndex: 0,
            mode: MODE_SELECT | (e.shiftKey ? MODE_RANGE : 0) | (e.ctrlKey ? MODE_APPEND : 0)
        });
        select({
            rowIndex: rowIndex,
            cellIndex: csv[0]?.length ?? 0,
            mode: MODE_SELECT | MODE_RANGE | (e.ctrlKey ? MODE_APPEND : 0)
        });
    }

    return (
        <th onMouseDown={onMouseDown} onContextMenu={onMenu}>{rowIndex + 1}</th>
    );
}
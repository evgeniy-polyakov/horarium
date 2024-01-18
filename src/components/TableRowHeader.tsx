import {MouseEvent} from "react";
import {MODE_APPEND, MODE_RANGE, MODE_SELECT, TableSelectionReducer} from "@/models/TableSelection";

export function TableRowHeader({csv, rowIndex, selectionReducer}: {
    csv: string[][],
    rowIndex: number,
    selectionReducer: TableSelectionReducer,
}) {

    function onClick(e: MouseEvent) {
        e.preventDefault();
        // todo allow to select ranges in one call
        selectionReducer[1]({
            rowIndex: rowIndex,
            cellIndex: 0,
            mode: MODE_SELECT | (e.shiftKey ? MODE_RANGE : 0) | (e.ctrlKey ? MODE_APPEND : 0)
        });
        selectionReducer[1]({
            rowIndex: rowIndex,
            cellIndex: csv[0]?.length ?? 0,
            mode: MODE_SELECT | MODE_RANGE | (e.ctrlKey ? MODE_APPEND : 0)
        });
    }

    return (
        <th onClick={onClick}>{rowIndex + 1}</th>
    );
}
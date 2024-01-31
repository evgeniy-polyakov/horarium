import {MouseEvent} from "react";
import {TableSelectionReducer} from "@/models/TableSelection";

export function TableAllHeader({csv, selectionReducer: [, select]}: {
    csv: string[][],
    selectionReducer: TableSelectionReducer,
}) {

    function onClick(e: MouseEvent) {
        e.preventDefault();
        select({
            action: "selectRange",
            startRow: 0,
            startCell: 0,
            endRow: csv.length - 1,
            endCell: csv[0].length - 1,
            clear: true
        });
    }

    return (
        <th onClick={onClick}></th>
    );
}
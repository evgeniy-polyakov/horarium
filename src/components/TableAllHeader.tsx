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
            range: [0, 0, csv.length - 1, csv[0].length - 1],
            clear: true
        });
    }

    return (
        <th onClick={onClick}></th>
    );
}
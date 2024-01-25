import {MouseEvent} from "react";
import {MODE_ALL, TableSelectionReducer} from "@/models/TableSelection";

export function TableAllHeader({csv, selectionReducer: [, select]}: {
    csv: string[][],
    selectionReducer: TableSelectionReducer,
}) {

    function onClick(e: MouseEvent) {
        e.preventDefault();
        select({
            rowIndex: csv.length,
            cellIndex: csv[0]?.length ?? 0,
            mode: MODE_ALL
        });
    }

    return (
        <th onClick={onClick}></th>
    );
}
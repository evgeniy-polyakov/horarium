import {MouseEvent} from "react";
import {MODE_ALL, TableSelectionReducer} from "@/models/TableSelection";

export function TableAllHeader({csv, selectionReducer}: {
    csv: string[][],
    selectionReducer: TableSelectionReducer,
}) {

    function onClick(e: MouseEvent) {
        e.preventDefault();
        selectionReducer[1]({
            rowIndex: csv.length,
            cellIndex: csv[0]?.length ?? 0,
            mode: MODE_ALL
        });
    }

    return (
        <th onClick={onClick}></th>
    );
}
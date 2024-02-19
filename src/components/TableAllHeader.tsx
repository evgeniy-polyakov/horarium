import {MouseEvent} from "react";
import {TableSelectionReducer} from "@/models/TableSelection";
import {CSV} from "@/models/CSV";
import {SelectAllAction} from "@/components/TableActions";
import {State} from "@/models/State";

export function TableAllHeader({csvState, selectionReducer, onMenu}: {
    csvState: State<CSV>,
    selectionReducer: TableSelectionReducer,
    onMenu?: (event: MouseEvent) => void,
}) {

    function onMouseDown(e: MouseEvent) {
        if (e.button !== 0) {
            return;
        }
        new SelectAllAction(csvState, selectionReducer).select();
    }

    return (
        <th onMouseDown={onMouseDown} onContextMenu={onMenu}></th>
    );
}
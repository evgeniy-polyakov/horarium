import {MouseEvent, useRef, useState} from "react";
import {MODE_APPEND, MODE_RANGE, MODE_SELECT, MODE_UNSELECT, TableSelectionReducer} from "@/models/TableSelection";
import {StateAssessor} from "@/models/StateAccessor";

export function TableCell({csv, rowIndex, cellIndex, selectionReducer, onEdit, mouseDown}: {
    csv: string[][],
    rowIndex: number,
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onEdit?: (value: string) => void,
    mouseDown: StateAssessor<boolean>,
}) {

    const [text, setText] = useState("");
    const [mouseAction, setMouseAction] = useState(false);
    const cell = useRef<HTMLTableCellElement>(null);
    const cellSelection = selectionReducer[0].file.cellSelection;

    const oldText = csv[rowIndex]?.[cellIndex];
    if (text !== oldText) {
        setText(oldText);
    }

    if (!mouseDown.get() && mouseAction) {
        setMouseAction(false);
    }

    function callSelectionAction(e: MouseEvent, extraModes = 0) {
        e.preventDefault();
        selectionReducer[1]({
            rowIndex, cellIndex,
            mode: (e.ctrlKey ? MODE_APPEND : 0) | (e.shiftKey ? MODE_RANGE : 0) |
                (cellSelection.contains(rowIndex, cellIndex) ? MODE_UNSELECT : MODE_SELECT) |
                extraModes
        });
    }

    function onMouseDown(e: MouseEvent) {
        mouseDown.set(true);
        setMouseAction(true);
        callSelectionAction(e);
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    function onMouseEnter(e: MouseEvent) {
        if (mouseDown.get() && !mouseAction) {
            setMouseAction(true);
            callSelectionAction(e, MODE_RANGE);
        }
    }

    function onMouseLeave(e: MouseEvent) {
        setMouseAction(false);
    }

    function onMouseUp(e: MouseEvent) {
        mouseDown.set(false);
        onMouseEnter(e);
    }

    function onEditCell() {
        const textarea = document.createElement("textarea");
        cell.current?.append(textarea);
        textarea.value = text;
        textarea.style.height = `${textarea.scrollHeight + 2}px`;
        textarea.focus();
        textarea.addEventListener("blur", () => {
            if (textarea.value !== text) {
                setText(textarea.value);
                onEdit?.(textarea.value);
            }
            textarea.remove();
        });
    }

    return (
        <td ref={cell} className={cellSelection.contains(rowIndex, cellIndex) ? "selected" : ""}
            onDoubleClick={onEditCell} onMouseDown={onMouseDown} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onMouseUp={onMouseUp}>
            <span>{text}</span>
        </td>
    );
}
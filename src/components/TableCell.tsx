import {MouseEvent, useRef, useState} from "react";
import {MODE_APPEND, MODE_RANGE, MODE_SELECT, MODE_UNSELECT, TableSelectionReducer} from "@/models/TableSelection";
import {StateAssessor} from "@/models/StateAccessor";
import {classList} from "@/models/classList";
import {State} from "@/models/State";

export function TableCell({csv, rowIndex, cellIndex, selectionReducer, cellEdit, onEdit, onMenu, mouseDownState: [mouseDown, setMouseDown]}: {
    csv: string[][],
    rowIndex: number,
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    cellEdit: StateAssessor<[number, number]>,
    onEdit?: (value: string) => void,
    onMenu?: (e: MouseEvent) => void,
    mouseDownState: State<boolean>,
}) {

    const [text, setText] = useState("");
    const [mouseAction, setMouseAction] = useState(false);
    const [editing, setEditing] = useState(false);
    const cell = useRef<HTMLTableCellElement>(null);
    const cellSelection = selectionReducer[0].file.cellSelection;

    const oldText = csv[rowIndex]?.[cellIndex];
    if (text !== oldText) {
        setText(oldText);
    }

    if (!mouseDown && mouseAction) {
        setMouseAction(false);
    }

    if (isEditing() && !editing) {
        setEditing(true);
        edit();
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

    function isEditing() {
        return cellEdit.get()[0] === rowIndex && cellEdit.get()[1] === cellIndex;
    }

    function edit() {
        const textarea = document.createElement("textarea");
        const getMinHeight = () => {
            return textarea.scrollHeight + 2;
        }
        cell.current?.append(textarea);
        cell.current?.classList.add("editing");
        textarea.value = text;
        textarea.style.height = `${getMinHeight()}px`;
        textarea.focus();
        textarea.addEventListener("blur", () => {
            if (textarea.value !== text) {
                setText(textarea.value);
                onEdit?.(textarea.value);
            }
            textarea.remove();
            cell.current?.classList.remove("editing");
            setEditing(false);
            cellEdit.set([-1, -1]);
        });
        textarea.addEventListener("input", () => {
            const minHeight = getMinHeight();
            if (textarea.offsetHeight < minHeight) {
                textarea.style.height = `${getMinHeight()}px`;
            }
        });
    }

    function onMouseDown(e: MouseEvent) {
        if (isEditing()) return;
        setMouseDown(true);
        setMouseAction(true);
        callSelectionAction(e);
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    function onMouseEnter(e: MouseEvent) {
        if (isEditing()) return;
        if (mouseDown && !mouseAction) {
            setMouseAction(true);
            callSelectionAction(e, MODE_RANGE);
        }
    }

    function onMouseLeave(e: MouseEvent) {
        if (isEditing()) return;
        setMouseAction(false);
    }

    function onMouseUp(e: MouseEvent) {
        if (isEditing()) return;
        setMouseDown(false);
        onMouseEnter(e);
    }

    function onDoubleClick() {
        if (isEditing()) return;
        cellEdit.set([rowIndex, cellIndex]);
    }

    function onContextMenu(e: MouseEvent) {
        if (!isEditing() && onMenu) {
            onMenu(e);
        }
    }

    return (
        <td ref={cell}
            className={classList({
                selected: cellSelection.contains(rowIndex, cellIndex),
                focused: cellSelection.isFocused(rowIndex, cellIndex)
            })}
            onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
            onMouseDown={onMouseDown} onMouseUp={onMouseUp}
            onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <span>{text}</span>
        </td>
    );
}
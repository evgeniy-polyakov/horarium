import {MouseEvent, useRef, useState} from "react";
import {MODE_APPEND, MODE_RANGE, MODE_SELECT, MODE_UNSELECT, TableSelectionReducer} from "@/models/TableSelection";
import {StateAssessor} from "@/models/StateAccessor";
import {classList} from "@/models/classList";

export function TableCell({csv, rowIndex, cellIndex, selectionReducer, onEdit, onMenu, mouseDown}: {
    csv: string[][],
    rowIndex: number,
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onEdit?: (value: string) => void,
    onMenu?: (e: MouseEvent) => void,
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

    function isEditing() {
        return cell.current?.classList.contains("editing");
    }

    function onMouseDown(e: MouseEvent) {
        if (isEditing()) return;
        mouseDown.set(true);
        setMouseAction(true);
        callSelectionAction(e);
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    function onMouseEnter(e: MouseEvent) {
        if (isEditing()) return;
        if (mouseDown.get() && !mouseAction) {
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
        mouseDown.set(false);
        onMouseEnter(e);
    }

    function onDoubleClick() {
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
        });
        textarea.addEventListener("input", () => {
            const minHeight = getMinHeight();
            if (textarea.offsetHeight < minHeight) {
                textarea.style.height = `${getMinHeight()}px`;
            }
        });
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
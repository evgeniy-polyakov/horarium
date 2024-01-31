import {MouseEvent, useRef, useState} from "react";
import {MODE_APPEND, MODE_RANGE, MODE_SELECT, MODE_UNSELECT, TableSelectionReducer} from "@/models/TableSelection";
import {classList} from "@/models/classList";
import {State} from "@/models/State";

export function TableCell({csv, rowIndex, cellIndex, onEdit, onMenu, selectionReducer: [selection, select], cellEditState: [cellEdit, setCellEdit], mouseDownState: [mouseDown, setMouseDown]}: {
    csv: string[][],
    rowIndex: number,
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onEdit?: (value: string) => void,
    onMenu?: (e: MouseEvent) => void,
    cellEditState: State<[number, number]>,
    mouseDownState: State<[number, number, boolean?]>,
}) {

    const [text, setText] = useState("");
    const [thisCellEdit, setThisCellEdit] = useState(false);
    const cell = useRef<HTMLTableCellElement>(null);
    const tableSelection = selection.file.tableSelection;

    const oldText = csv[rowIndex]?.[cellIndex];
    if (text !== oldText) {
        setText(oldText);
    }

    if (isEditing() && !thisCellEdit) {
        setThisCellEdit(true);
        edit();
    }

    function callSelectionAction(e: MouseEvent, extraModes = 0) {
        e.preventDefault();
        select({
            rowIndex, cellIndex,
            mode: (e.ctrlKey ? MODE_APPEND : 0) | (e.shiftKey ? MODE_RANGE : 0) |
                (tableSelection.contains(rowIndex, cellIndex) ? MODE_UNSELECT : MODE_SELECT) |
                extraModes
        });
    }

    function isMouseDown() {
        return mouseDown[0] >= 0 && mouseDown[1] >= 0;
    }

    function isStartCellSelected() {
        return !!mouseDown[2];
    }

    function isEditing() {
        return cellEdit[0] === rowIndex && cellEdit[1] === cellIndex;
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
            setThisCellEdit(false);
            setCellEdit([-1, -1]);
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
        setMouseDown([rowIndex, cellIndex, e.ctrlKey ? tableSelection.contains(rowIndex, cellIndex) : false]);
        if (e.button !== 0) {
            select({action: "setFocus", rowIndex, cellIndex});
        } else if (e.shiftKey) {
            select({
                action: "selectRange",
                startRow: tableSelection.focusRow,
                startCell: tableSelection.focusCell,
                endRow: rowIndex,
                endCell: cellIndex,
                clear: !e.ctrlKey,
            });
        } else {
            select({action: "setFocus", rowIndex, cellIndex});
            select({
                action: "selectRange",
                startRow: rowIndex,
                startCell: cellIndex,
                endRow: rowIndex,
                endCell: cellIndex,
                clear: !e.ctrlKey,
            });
        }
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    function onMouseEnter(e: MouseEvent) {
        if (isEditing()) return;
        if (isMouseDown()) {
            if (isStartCellSelected()) {
                select({action: "excludeRange", startRow: mouseDown[0], startCell: mouseDown[1], endRow: rowIndex, endCell: cellIndex, draft: true});
            } else {
                select({action: "selectRange", startRow: tableSelection.focusRow, startCell: tableSelection.focusCell, endRow: rowIndex, endCell: cellIndex});
            }
        }
    }

    function onMouseUp(e: MouseEvent) {
        if (isEditing()) return;
        if (isMouseDown() && e.ctrlKey && !e.shiftKey) {
            if (isStartCellSelected()) {
                select({action: "excludeRange", startRow: mouseDown[0], startCell: mouseDown[1], endRow: rowIndex, endCell: cellIndex});
            } else {
                select({action: "selectRange", startRow: mouseDown[0], startCell: mouseDown[1], endRow: rowIndex, endCell: cellIndex});
            }
        }
        setMouseDown([-1, -1]);
    }

    function onDoubleClick() {
        if (isEditing()) return;
        setCellEdit([rowIndex, cellIndex]);
    }

    function onContextMenu(e: MouseEvent) {
        if (!isEditing() && onMenu) {
            onMenu(e);
        }
    }

    return (
        <td ref={cell}
            className={classList({
                selected: tableSelection.contains(rowIndex, cellIndex),
                focused: tableSelection.isFocus(rowIndex, cellIndex)
            })}
            onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
            onMouseDown={onMouseDown} onMouseUp={onMouseUp}
            onMouseEnter={onMouseEnter}>
            <span>{text}</span>
        </td>
    );
}
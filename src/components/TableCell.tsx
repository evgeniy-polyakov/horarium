import {KeyboardEvent, MouseEvent, useRef, useState} from "react";
import {TableSelectionReducer} from "@/models/TableSelection";
import {classList} from "@/models/classList";
import {State} from "@/models/State";
import {Cell} from "@/models/Cell";
import {CSV} from "@/models/CSV";

export function TableCell({csv, rowIndex, cellIndex, onEdit, onMenu, selectionReducer: [selection, select], cellEditState: [cellEdit, setCellEdit], mouseDownState: [mouseDown, setMouseDown], navKeyDownState: [navKeyDown, setNavKeyDown]}: {
    csv: CSV,
    rowIndex: number,
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onEdit?: (value: string) => void,
    onMenu?: (e: MouseEvent) => void,
    cellEditState: State<Cell>,
    mouseDownState: State<[...Cell, boolean?]>,
    navKeyDownState: State<Record<string, number>>,
}) {

    const [text, setText] = useState("");
    const [thisCellEdit, setThisCellEdit] = useState(false);
    const [thisCellFocus, setThisCellFocus] = useState(false);
    const [textArea, setTextArea] = useState<HTMLTextAreaElement>();
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

    if (tableSelection.isFocus(rowIndex, cellIndex)) {
        if (!thisCellFocus) {
            cell.current?.focus();
            setThisCellFocus(true);
        }
    } else if (thisCellFocus) {
        setThisCellFocus(false);
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
        setTextArea(textarea);
    }

    function confirmEdit() {
        cell.current?.focus();
    }

    function cancelEdit() {
        if (textArea) textArea.value = text;
        cell.current?.focus();
    }

    function onMouseDown(e: MouseEvent) {
        if (isEditing()) return;
        setMouseDown([rowIndex, cellIndex, e.ctrlKey ? tableSelection.contains(rowIndex, cellIndex) : false]);
        if (e.button !== 0) {
            select({action: "setFocus", rowIndex, cellIndex});
        } else if (e.shiftKey) {
            const hasFocus = tableSelection.hasFocus();
            if (!hasFocus) {
                select({action: "setFocus", rowIndex, cellIndex});
            }
            select({
                action: "selectRange",
                range: [
                    hasFocus ? tableSelection.focusRow : rowIndex,
                    hasFocus ? tableSelection.focusCell : cellIndex,
                    rowIndex, cellIndex],
                clear: !e.ctrlKey, replace: true,
            });
        } else {
            select({action: "setFocus", rowIndex, cellIndex});
            if (e.ctrlKey && tableSelection.contains(rowIndex, cellIndex)) {
                select({
                    action: "excludeRange",
                    range: [rowIndex, cellIndex],
                });
            } else if (e.ctrlKey) {
                select({
                    action: "selectRange",
                    range: [rowIndex, cellIndex],
                })
            } else {
                select({
                    action: "clearSelection",
                });
            }
        }
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    function onMouseEnter(e: MouseEvent) {
        if (isEditing()) return;
        if (isMouseDown()) {
            if (isStartCellSelected()) {
                select({
                    action: "excludeRange",
                    range: [mouseDown[0], mouseDown[1], rowIndex, cellIndex],
                    draft: true
                });
            } else {
                select({
                    action: "selectRange",
                    range: [tableSelection.focusRow, tableSelection.focusCell, rowIndex, cellIndex],
                    draft: true, replace: true
                });
            }
        }
    }

    function onMouseUp(e: MouseEvent) {
        if (isEditing()) return;
        select({action: "commitDraft"});
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

    function onKeyDown(e: KeyboardEvent) {
        if (!tableSelection.hasFocus()) {
            return;
        }
        const focusRow = tableSelection.focusRow;
        const focusCell = tableSelection.focusCell;
        const key = e.key;
        const editing = cellEdit[0] >= 0 && cellEdit[1] >= 0;
        if (key === "Escape" && editing) {
            e.preventDefault();
            cancelEdit();
            return;
        } else if (key === "Enter" && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            if (editing) {
                confirmEdit();
            } else {
                setCellEdit([focusRow, focusCell]);
            }
            return;
        } else if (editing) {
            return;
        }
        const maxRow = csv.length - 1;
        const maxCell = csv[focusRow].length - 1;
        const rowOffset = {
            ArrowUp: -1, ArrowDown: 1,
            Tab: e.shiftKey ? (focusCell === 0 ? -1 : 0) : (focusCell === maxCell ? 1 : 0)
        }[key] ?? 0;
        const cellOffset = {
            ArrowLeft: -1, ArrowRight: 1,
            Tab: e.shiftKey ? (focusCell === 0 ? maxCell : -1) : (focusCell === maxCell ? -maxCell : 1)
        }[key] ?? 0;
        if (rowOffset !== 0 || cellOffset !== 0) {
            e.preventDefault();
            const t = new Date().getTime();
            if (navKeyDown[key] === undefined || t - navKeyDown[key] > 50) {
                setNavKeyDown({...navKeyDown, [key]: t});
                const nextRow = focusRow + rowOffset;
                const nextCell = focusCell + cellOffset;
                if (nextRow >= 0 && nextRow <= maxRow && nextCell >= 0 && nextCell <= maxCell) {
                    select({
                        action: "setFocus",
                        rowIndex: nextRow,
                        cellIndex: nextCell,
                    });
                    if (key === "Tab") return;
                    if (e.shiftKey) {
                        select({
                            action: tableSelection.contains(focusRow, focusCell) ? "expandRange" : "selectRange",
                            range: [focusRow, focusCell, nextRow, nextCell],
                            clear: !e.ctrlKey,
                        });
                    } else if (e.ctrlKey && (tableSelection.contains(focusRow, focusCell) && tableSelection.contains(nextRow, nextCell))) {
                        select({
                            action: "excludeRange",
                            range: [focusRow, focusCell],
                        });
                    } else if (e.ctrlKey) {
                        select({
                            action: "selectRange",
                            range: [focusRow, focusCell, nextRow, nextCell],
                        });
                    }
                }
            }
        }
    }

    function onKeyUp(e: KeyboardEvent) {
        if (tableSelection.isFocus(rowIndex, cellIndex)) {
            const key = e.key;
            delete navKeyDown[key];
            setNavKeyDown({...navKeyDown});
        }
    }

    return (
        <td ref={cell} tabIndex={rowIndex * csv[0].length + cellIndex}
            className={classList({
                selected: tableSelection.contains(rowIndex, cellIndex),
                focused: tableSelection.isFocus(rowIndex, cellIndex)
            })}
            onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
            onMouseDown={onMouseDown} onMouseUp={onMouseUp}
            onMouseEnter={onMouseEnter} onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
            <span>{text}</span>
        </td>
    );
}
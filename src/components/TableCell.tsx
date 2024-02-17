import {KeyboardEvent, MouseEvent, useEffect, useRef, useState} from "react";
import {TableSelectionReducer} from "@/models/TableSelection";
import {classList} from "@/models/classList";
import {State} from "@/models/State";
import {Cell} from "@/models/Cell";
import {CSV} from "@/models/CSV";
import {Key} from "@/models/Key";
import {KeyDownRepeater} from "@/models/KeyDownRepeater";
import {ClearCellsAction, CloneColumnAction, CloneRowAction, CopyCellsAction, CutCellsAction, DeleteColumnAction, DeleteRowAction, InsertColumnAction, InsertRowAction, PasteCellsAction} from "@/components/TableActions";
import {IMenuItem} from "@/components/IMenuItem";

export function TableCell({csvState, rowIndex, cellIndex, onEdit, onMenu, selectionReducer, cellEditState: [cellEdit, setCellEdit], mouseDownState: [mouseDown, setMouseDown], keyDownRepeater}: {
    csvState: State<CSV>,
    rowIndex: number,
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onEdit?: (value: string) => void,
    onMenu?: (e: MouseEvent) => void,
    cellEditState: State<Cell>,
    mouseDownState: State<[...Cell, boolean?]>,
    keyDownRepeater: KeyDownRepeater,
}) {

    const [csv] = csvState;
    const [selection, select] = selectionReducer;
    const [text, setText] = useState("");
    const [thisCellEdit, setThisCellEdit] = useState(false);
    const [textArea, setTextArea] = useState<HTMLTextAreaElement>();
    const cell = useRef<HTMLTableCellElement>(null);
    const tableSelection = selection.file.tableSelection;

    useEffect(() => {
        if (tableSelection.isFocus(rowIndex, cellIndex) && !isEditing()) {
            cell.current?.focus();
        }
    });

    const oldText = csv[rowIndex]?.[cellIndex];
    if (text !== oldText) {
        setText(oldText);
    }

    if (isEditing() && !thisCellEdit) {
        setThisCellEdit(true);
        edit();
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
            let focusRow = tableSelection.focusRow;
            let focusCell = tableSelection.focusCell;
            const hasFocus = tableSelection.hasFocus();
            if (!hasFocus) {
                focusRow = rowIndex;
                focusCell = cellIndex;
                select({action: "setFocus", rowIndex, cellIndex});
            }
            if (e.ctrlKey && !tableSelection.contains(focusRow, focusCell)) {
                select({
                    action: "excludeRange",
                    range: [focusRow, focusCell, rowIndex, cellIndex],
                });
            } else {
                select({
                    action: "selectRange",
                    range: [focusRow, focusCell, rowIndex, cellIndex],
                    clear: !e.ctrlKey, replace: true,
                });
            }
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
        const key = e.key;
        if (!keyDownRepeater.isKeyDown(key, key === Key.Enter)) {
            e.preventDefault();
            return;
        }
        const focusRow = tableSelection.focusRow;
        const focusCell = tableSelection.focusCell;
        const editing = cellEdit[0] >= 0 && cellEdit[1] >= 0;
        let action: IMenuItem | undefined;
        if (key === Key.Escape && editing) {
            e.preventDefault();
            cancelEdit();
        } else if (key === Key.F2 && !editing) {
            e.preventDefault();
            setCellEdit([focusRow, focusCell]);
        } else if (key === Key.Enter && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            if (editing) {
                confirmEdit();
            } else {
                setCellEdit([focusRow, focusCell]);
            }
        } else if (editing) {
            // no action in edit mode
        } else if (key === Key.Escape && !tableSelection.isEmpty()) {
            e.preventDefault();
            select({action: "clearSelection"});
        } else if (key === Key.Delete && e.ctrlKey && e.shiftKey) {
            action = new DeleteColumnAction(csvState, selectionReducer, focusCell);
        } else if (key === Key.Delete && e.ctrlKey) {
            action = new DeleteRowAction(csvState, selectionReducer, focusRow);
        } else if (key === Key.Delete) {
            action = new ClearCellsAction(csvState, selectionReducer, focusRow, focusCell);
        } else if (key === Key.c && e.ctrlKey) {
            action = new CopyCellsAction(csvState, selectionReducer, focusRow, focusCell);
        } else if (key === Key.x && e.ctrlKey) {
            action = new CutCellsAction(csvState, selectionReducer, focusRow, focusCell);
        } else if (key === Key.v && e.ctrlKey) {
            action = new PasteCellsAction(csvState, selectionReducer, focusRow, focusCell);
        } else if (key === Key.D && e.ctrlKey && e.shiftKey) {
            action = new CloneColumnAction(csvState, selectionReducer, focusCell);
        } else if (key === Key.d && e.ctrlKey) {
            action = new CloneRowAction(csvState, selectionReducer, focusRow);
        } else if (key === Key.Insert && e.shiftKey) {
            action = new InsertColumnAction(csvState, selectionReducer, focusCell, e.ctrlKey);
        } else if (key === Key.Insert) {
            action = new InsertRowAction(csvState, selectionReducer, focusRow, e.ctrlKey);
        }
        if (action) {
            e.preventDefault();
            action.select?.();
        } else {
            onKeyNav(e);
        }
    }

    function onKeyNav(e: KeyboardEvent) {
        const focusRow = tableSelection.focusRow;
        const focusCell = tableSelection.focusCell;
        const key = e.key;
        const maxRow = csv.length - 1;
        const maxCell = csv[focusRow].length - 1;
        const rowOffset = {
            [Key.ArrowUp]: -1, [Key.ArrowDown]: 1,
            [Key.Tab]: e.shiftKey ? (focusCell === 0 ? -1 : 0) : (focusCell === maxCell ? 1 : 0),
            [Key.Home]: e.ctrlKey ? -focusRow : 0,
            [Key.End]: e.ctrlKey ? maxRow - focusRow : 0,
        }[key];
        const cellOffset = {
            [Key.ArrowLeft]: -1, [Key.ArrowRight]: 1,
            [Key.Tab]: e.shiftKey ? (focusCell === 0 ? maxCell : -1) : (focusCell === maxCell ? -maxCell : 1),
            [Key.Home]: -focusCell,
            [Key.End]: maxCell - focusCell,
        }[key];
        const arrowKeys: string[] = [Key.ArrowUp, Key.ArrowDown, Key.ArrowLeft, Key.ArrowRight];
        if (rowOffset !== undefined || cellOffset !== undefined) {
            e.preventDefault();
        }
        if (rowOffset !== 0 || cellOffset !== 0) {
            const nextRow = focusRow + (rowOffset ?? 0);
            const nextCell = focusCell + (cellOffset ?? 0);
            if (nextRow >= 0 && nextRow <= maxRow && nextCell >= 0 && nextCell <= maxCell) {
                select({
                    action: "setFocus",
                    rowIndex: nextRow,
                    cellIndex: nextCell,
                });
                if (arrowKeys.indexOf(key) < 0) return;
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

    return (
        <td ref={cell} tabIndex={rowIndex * csv[0].length + cellIndex}
            className={classList({
                selected: tableSelection.contains(rowIndex, cellIndex),
                focused: tableSelection.isFocus(rowIndex, cellIndex)
            })}
            onDoubleClick={onDoubleClick} onContextMenu={onContextMenu}
            onMouseDown={onMouseDown} onMouseUp={onMouseUp}
            onMouseEnter={onMouseEnter} onKeyDown={onKeyDown}>
            <span>{text}</span>
        </td>
    );
}
import {MouseEvent, useRef, useState} from "react";
import {TableSelectionMode, TableSelectionReducer} from "@/models/TableSelection";

export function TableCell({csv, rowIndex, cellIndex, selectionReducer, onEdit}: {
    csv: string[][],
    rowIndex: number,
    cellIndex: number,
    selectionReducer: TableSelectionReducer,
    onEdit?: (value: string) => void,
}) {

    const [text, setText] = useState("");
    const cell = useRef<HTMLTableCellElement>(null);
    const cellSelection = selectionReducer[0].file.cellSelection;

    const oldText = csv[rowIndex]?.[cellIndex];
    if (text !== oldText) {
        setText(oldText);
    }

    function onSelectCell(e: MouseEvent) {
        e.preventDefault();
        selectionReducer[1]({
            rowIndex, cellIndex,
            mode: e.shiftKey ? TableSelectionMode.Range : e.ctrlKey ? TableSelectionMode.Append : TableSelectionMode.Single,
            type: cellSelection.isSelected(rowIndex, cellIndex) ? "unselect" : "select",
        });
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
        <td ref={cell} className={cellSelection.isSelected(rowIndex, cellIndex) ? "selected" : ""}
            onDoubleClick={onEditCell} onClick={onSelectCell}>
            <span>{text}</span>
        </td>
    );
}
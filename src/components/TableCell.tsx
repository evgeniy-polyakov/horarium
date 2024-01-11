import {useRef, useState} from "react";

export function TableCell({row, index, onEdit}: {
    row: string[],
    index: number,
    onEdit?: (value: string) => void,
}) {

    const [text, setText] = useState("");
    const cell = useRef<HTMLTableCellElement>(null);

    if (text !== row[index]) {
        setText(row[index]);
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
        <td ref={cell} onDoubleClick={onEditCell}>
            <span>{text}</span>
        </td>
    );
}
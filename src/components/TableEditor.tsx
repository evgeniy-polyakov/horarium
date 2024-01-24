import {FileModel} from "@/models/FileModel";
import {MouseEvent, useEffect, useReducer, useRef, useState} from "react";
import {stringify} from "csv-stringify/browser/esm";
import {TableCell} from "@/components/TableCell";
import {tableSelectionReducer} from "@/models/TableSelection";
import {useStateAccessor} from "@/models/StateAccessor";
import {parseCSV} from "@/models/CSVParser";
import {TableColumnHeader} from "@/components/TableColumnHeader";
import {TableRowHeader} from "@/components/TableRowHeader";
import {TableAllHeader} from "@/components/TableAllHeader";
import {Menu} from "@/components/Menu";
import {IMenuItem} from "@/components/IMenuItem";

export function TableEditor({file}: {
    file: FileModel
}) {
    const [textContent, setTextContent] = useState("");
    const [csv, setCSV] = useState<string[][]>([]);
    const mouseDown = useStateAccessor(false);
    const selectionReducer = useReducer(tableSelectionReducer, {file});
    const [contextMenu, setContextMenu] = useState<{ items: IMenuItem[], x: number, y: number, remove: () => void }>();
    const table = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (mouseDown.get()) {
            window.addEventListener("mouseup", onMouseUp, false);
        }
        return () => {
            window.removeEventListener("mouseup", onMouseUp, false);
        }
    }, [mouseDown]);

    if (selectionReducer[0].file !== file) {
        mouseDown.set(false);
        selectionReducer[1]({file: file, mode: "update"});
    }

    if (textContent !== file.textContent) {
        setTextContent(file.textContent);
        parseCSV(file.textContent).then(records => setCSV(records));
    }

    function onMouseUp() {
        mouseDown.set(false);
    }

    function onCellEdit(rowIndex: number, cellIndex: number, value: string) {
        csv[rowIndex][cellIndex] = value;
        stringify(csv, (err, output) => {
            if (!err) {
                file.textContent = output;
            } else {
                console.error(err);
            }
        });
    }

    function onCellMenu(event: MouseEvent, rowIndex: number, cellIndex: number) {
        const b = table.current?.getBoundingClientRect();
        setContextMenu({
            items: [],
            x: event.clientX - (b?.x ?? 0),
            y: event.clientY - (b?.y ?? 0),
            remove: () => setContextMenu(undefined)
        });
    }

    return (
        <div className="table-editor">
            {csv.length > 0 && (
                <table className="columns">
                    <thead>
                    <tr>
                        <TableAllHeader csv={csv} selectionReducer={selectionReducer}/>
                        {csv[0].map((cell, cellIndex) => <TableColumnHeader key={cellIndex} cellIndex={cellIndex} csv={csv} selectionReducer={selectionReducer}/>)}
                    </tr>
                    </thead>
                </table>
            )}
            <table className="content" ref={table}>
                <tbody>
                {csv.map((row, rowIndex) =>
                    <tr key={rowIndex} style={{zIndex: csv.length - rowIndex}}>
                        <TableRowHeader rowIndex={rowIndex} csv={csv} selectionReducer={selectionReducer}/>
                        {
                            row.map((cell, cellIndex) =>
                                <TableCell key={cellIndex} csv={csv} rowIndex={rowIndex} cellIndex={cellIndex}
                                           selectionReducer={selectionReducer} mouseDown={mouseDown}
                                           onEdit={value => onCellEdit(rowIndex, cellIndex, value)}
                                           onMenu={event => onCellMenu(event, rowIndex, cellIndex)}/>)
                        }
                    </tr>
                )}
                </tbody>
            </table>
            {contextMenu && <Menu {...contextMenu}/>}
        </div>
    );
}
import {FileModel} from "@/models/FileModel";
import {useEffect, useReducer, useState} from "react";
import {stringify} from "csv-stringify/browser/esm";
import {TableCell} from "@/components/TableCell";
import {tableSelectionReducer} from "@/models/TableSelection";
import {useStateAccessor} from "@/models/StateAccessor";
import {parseCSV} from "@/models/CSVParser";
import {TableColumnHeader} from "@/components/TableColumnHeader";
import {TableRowHeader} from "@/components/TableRowHeader";
import {TableAllHeader} from "@/components/TableAllHeader";

export function TableEditor({file}: {
    file: FileModel
}) {
    const [textContent, setTextContent] = useState("");
    const [csv, setCSV] = useState<string[][]>([]);
    const mouseDown = useStateAccessor(false);
    const selectionReducer = useReducer(tableSelectionReducer, {file});

    const onMouseUp = () => {
        mouseDown.set(false);
    };

    useEffect(() => {
        if (mouseDown.get()) {
            window.addEventListener("mouseup", onMouseUp, false);
        } else {
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

    function onEditCell(row: string[], cellIndex: number, value: string) {
        row[cellIndex] = value;
        stringify(csv, (err, output) => {
            if (!err) {
                file.textContent = output;
            } else {
                console.error(err);
            }
        });
    }

    return (
        <div className="table-editor">
            {csv.length > 0 && (
                <table className="columns">
                    <thead>
                    <tr>
                        <TableAllHeader csv={csv} selectionReducer={selectionReducer}/>
                        {csv[0].map((cell, cellIndex) => <TableColumnHeader cellIndex={cellIndex} csv={csv} selectionReducer={selectionReducer}/>)}
                    </tr>
                    </thead>
                </table>
            )}
            <table className="content">
                <tbody>
                {csv.map((row, rowIndex) =>
                    <tr key={rowIndex} style={{zIndex: csv.length - rowIndex}}>
                        <TableRowHeader rowIndex={rowIndex} csv={csv} selectionReducer={selectionReducer}/>
                        {
                            row.map((cell, cellIndex) =>
                                <TableCell key={cellIndex} csv={csv} rowIndex={rowIndex} cellIndex={cellIndex}
                                           selectionReducer={selectionReducer} mouseDown={mouseDown}
                                           onEdit={value => onEditCell(row, cellIndex, value)}/>)
                        }
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
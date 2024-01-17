import {FileModel} from "@/models/FileModel";
import {useReducer, useState} from "react";
import {parse} from 'csv-parse/browser/esm';
import {stringify} from "csv-stringify/browser/esm";
import {TableCell} from "@/components/TableCell";
import {tableSelectionReducer} from "@/models/TableSelection";

export function TableEditor({file}: {
    file: FileModel
}) {
    const [textContent, setTextContent] = useState("");
    const [csv, setCSV] = useState<string[][]>([]);
    const selectionReducer = useReducer(tableSelectionReducer, {file});

    if (selectionReducer[0].file !== file) {
        selectionReducer[1]({file: file, mode: "update"});
    }

    if (textContent !== file.textContent) {
        setTextContent(file.textContent);
        parse(file.textContent, {
            relaxColumnCount: true,
            relaxQuotes: true,
        }, (err, records: string[][]) => {
            if (!err) {
                const columns = records.reduce((a, t) => Math.max(t.length, a), 0);
                records.forEach(it => {
                    while (it.length < columns) it.push("");
                });
                setCSV(records);
            } else {
                setCSV([]);
                console.error(err);
            }
        });
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
            <table>
                <tbody>
                {csv.map((row, rowIndex) =>
                    <tr key={rowIndex} style={{zIndex: csv.length - rowIndex}}>{
                        row.map((cell, cellIndex) =>
                            <TableCell key={cellIndex} csv={csv} rowIndex={rowIndex} cellIndex={cellIndex}
                                       selectionReducer={selectionReducer}
                                       onEdit={value => onEditCell(row, cellIndex, value)}/>)
                    }</tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
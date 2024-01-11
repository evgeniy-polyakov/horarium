import {FileModel} from "@/models/FileModel";
import {useState} from "react";
import {parse} from 'csv-parse/browser/esm';
import {stringify} from "csv-stringify/browser/esm";
import {TableCell} from "@/components/TableCell";

export function TableEditor({file}: {
    file: FileModel
}) {
    const [textContent, setTextContent] = useState("");
    const [csv, setCSV] = useState<string[][]>([]);
    let columns = 0;

    if (textContent !== file.textContent) {
        setTextContent(file.textContent);
        parse(file.textContent, {
            relaxColumnCount: true,
            relaxQuotes: true,
        }, (err, records: string[][]) => {
            if (!err) {
                columns = records.reduce((a, t) => Math.max(t.length, a), 0);
                records.forEach(it => {
                    while (it.length < columns) it.push("");
                });
                setCSV(records);
            } else {
                columns = 0;
                setCSV([]);
                console.error(err);
            }
        });
    }

    function onEditCell(row: string[], index: number, value: string) {
        row[index] = value;
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
                            <TableCell key={cellIndex} row={row} index={cellIndex} onEdit={value => onEditCell(row, cellIndex, value)}/>)
                    }</tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
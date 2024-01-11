import {FileModel} from "@/models/FileModel";
import {useState} from "react";
import {parse} from 'csv-parse/browser/esm';

export function TableEditor({file}: {
    file: FileModel
}) {
    const [textContent] = useState("");
    const [csv, setCSV] = useState<string[][]>([]);
    let columns = 0;
    if (textContent !== file.textContent) {
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
    return (
        <div className="table-editor">
            <table>
                <tbody>
                {csv.map((row, i) =>
                    <tr key={i}>{
                        row.map((cell, j) => <td key={j}>{cell}</td>)
                    }</tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
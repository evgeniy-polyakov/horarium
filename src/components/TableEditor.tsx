import {FileModel} from "@/models/FileModel";
import {useState} from "react";
import {parse} from 'csv-parse/browser/esm';

export function TableEditor({file}: {
    file: FileModel
}) {
    const [textContent] = useState("");
    const [csv, setCSV] = useState<string[][]>([]);
    if (textContent !== file.textContent) {
        parse(file.textContent, {
            relaxColumnCount: true,
            relaxQuotes: true,
        }, (err, records, info) => {
            if (!err) {
                setCSV(records);
            } else {
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
import {parse} from "csv-parse";
import {stringify} from "csv-stringify";
import {FileModel} from "@/models/FileModel";

export async function parseCSV(value: string) {
    return new Promise<string[][]>((res, rej) => parse(value, {
        relaxColumnCount: true,
        relaxQuotes: true,
    }, (err, records: string[][]) => {
        if (!err) {
            const columns = records.reduce((a, t) => Math.max(t.length, a), 0);
            records.forEach(it => {
                while (it.length < columns) it.push("");
            });
            if (records.length === 0) {
                records = [[""]];
            } else if (records[0].length === 0) {
                records[0].push("");
            }
            res(records);
        } else {
            console.error(err);
            res([[""]]);
        }
    }));
}

export async function stringifyCSV(csv: string[][], file: FileModel) {
    return new Promise<string>((res, rej) => stringify(csv, (err, output) => {
        if (!err) {
            file.textContent = output;
            res(output);
        } else {
            console.error(err);
            res("");
        }
    }));
}
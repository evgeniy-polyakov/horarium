import {Cell} from "@/models/Cell";

export type CSV = string[][];

export function csvRows(csv: CSV) {
    return csv.length;
}

export function csvColumns(csv: CSV) {
    return csv[0]?.length ?? 0;
}

export function csvSize(csv: CSV) {
    return [csv.length, csv[0]?.length ?? 0] as Cell;
}
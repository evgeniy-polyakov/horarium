import {FileModel} from "@/models/FileModel";
import {Dispatch} from "react";

export enum TableSelectionMode {
    Single = 0,
    Append = 1,
    Range = 2,
}

export class TableSelection {

    private indices: number[] = [];
    private hash: Record<`${number}_${number}`, boolean> = {};

    isSelected(rowIndex: number, cellIndex: number) {
        return this.hash[`${rowIndex}_${cellIndex}`];
    }

    toggleSelection(rowIndex: number, cellIndex: number, mode: TableSelectionMode) {
        switch (mode) {
            case TableSelectionMode.Single:
                this.indices = [rowIndex, cellIndex];
                break;
        }
        this.hash = {};
        for (let i = 0; i < this.indices.length; i += 2) {
            this.hash[`${this.indices[i]}_${this.indices[i + 1]}`] = true;
        }
    }
}

export type TableSelectionReducer = [
    {
        file: FileModel
    },
    Dispatch<{
        rowIndex: number,
        cellIndex: number,
        mode: TableSelectionMode,
        type: "select" | "unselect" | "select-all"
    } | {
        file: FileModel,
        type: "update"
    }>
];

export function tableSelectionReducer(model: TableSelectionReducer[0], action: Parameters<TableSelectionReducer[1]>[0]): TableSelectionReducer[0] {
    if (action.type === "update") {
        return {...model, file: action.file};
    }
    model.file.cellSelection.toggleSelection(action.rowIndex, action.cellIndex, action.mode);
    return {...model};
}
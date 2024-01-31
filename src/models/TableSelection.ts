import {FileModel} from "@/models/FileModel";
import {Dispatch} from "react";

export const MODE_UP = 64;
export const MODE_DOWN = 128;
export const MODE_LEFT = 256;
export const MODE_RIGHT = 512;
export const MODE_CLEAR = 1024;

class SelectionRange {

    private excluded: number[] = [];

    constructor(
        private startRow: number,
        private startCell: number,
        private endRow: number,
        private endCell: number
    ) {
    }

    contains(rowIndex: number, cellIndex: number) {
        for (let i = 0; i < this.excluded.length; i += 2) {
            if (this.excluded[i] === rowIndex && this.excluded[i + 1] === cellIndex) {
                return false;
            }
        }
        return this.inRange(rowIndex, cellIndex);
    }

    isEmpty() {
        return this.excluded.length >= (1 + Math.abs(this.startRow - this.endRow)) * (1 + Math.abs(this.startCell - this.endCell)) * 2;
    }

    isStart(rowIndex: number, cellIndex: number) {
        return this.startRow === rowIndex && this.startCell === cellIndex;
    }

    shiftRow(rowIndex: number, distance: number) {
        rowIndex += distance;
        this.startRow = rowIndex;
        this.endRow = rowIndex;
        for (let i = 0; i < this.excluded.length; i += 2) {
            this.excluded[i] = rowIndex;
        }
    }

    shiftColumn(cellIndex: number, distance: number) {
        cellIndex += distance;
        this.startCell = cellIndex;
        this.endCell = cellIndex;
        for (let i = 1; i < this.excluded.length; i += 2) {
            this.excluded[i] = cellIndex;
        }
    }

    private inRange(rowIndex: number, cellIndex: number) {
        return (this.startRow <= this.endRow ? rowIndex >= this.startRow && rowIndex <= this.endRow : rowIndex <= this.startRow && rowIndex >= this.endRow) &&
            (this.startCell <= this.endCell ? cellIndex >= this.startCell && cellIndex <= this.endCell : cellIndex <= this.startCell && cellIndex >= this.endCell);
    }
}

export interface ITableSelection {
    contains(rowIndex: number, cellIndex: number): boolean;
    isFocus(rowIndex: number, cellIndex: number): boolean;
    hasFocus(): boolean;
    readonly focusRow: number;
    readonly focusCell: number;
}

export class TableSelection implements ITableSelection {

    private included: SelectionRange[] = [];
    private excluded: SelectionRange[] = [];
    private draftIncluded?: SelectionRange;
    private draftExcluded?: SelectionRange;
    private focus: [number, number] = [-1, -1];

    contains(rowIndex: number, cellIndex: number) {
        return (!this.draftExcluded?.contains(rowIndex, cellIndex) && !this.excluded.some(it => it.contains(rowIndex, cellIndex))) &&
            (this.draftIncluded?.contains(rowIndex, cellIndex) || this.included.some(it => it.contains(rowIndex, cellIndex)));
    }

    isFocus(rowIndex: number, cellIndex: number) {
        return this.focus[0] === rowIndex && this.focus[1] === cellIndex;
    }

    setFocus(rowIndex: number, cellIndex: number) {
        this.focus[0] = rowIndex;
        this.focus[1] = cellIndex;
    }

    hasFocus() {
        return this.focus[0] >= 0 && this.focus[1] >= 0;
    }

    get focusRow() {
        return this.focus[0];
    }

    get focusCell() {
        return this.focus[1];
    }

    clearFocus() {
        this.focus[0] = -1;
        this.focus[1] = -1;
    }

    clearSelection() {
        this.included = [];
        this.excluded = [];
    }

    selectRange(startRow: number, startCell: number, endRow: number, endCell: number, draft?: boolean) {
        if (draft) {
            this.draftIncluded = new SelectionRange(startRow, startCell, endRow, endCell);
        } else {
            this.included.push(new SelectionRange(startRow, startCell, endRow, endCell));
        }
    }

    removeRange(startRow: number, startCell: number) {
        this.included = this.included.filter(it => !it.isStart(startRow, startCell));
    }

    excludeRange(startRow: number, startCell: number, endRow: number, endCell: number, draft?: boolean) {
        // todo make exclude ranges consistent
        if (draft) {
            this.draftExcluded = new SelectionRange(startRow, startCell, endRow, endCell);
        } else {
            const range = new SelectionRange(startRow, startCell, endRow, endCell);
            this.excluded.push(range);
        }
    }

    commitDraft() {
        if (this.draftIncluded) {
            this.included.push(this.draftIncluded);
            this.draftIncluded = undefined;
        }
        if (this.draftExcluded) {
            this.excluded.push(this.draftExcluded);
            this.draftExcluded = undefined;
        }
    }
}

export type TableSelectionReducer = [
    {
        file: FileModel
    },
    Dispatch<{
        action?: "",
        rowIndex: number,
        cellIndex: number,
        mode: number,
    } | {
        action: "update",
        file: FileModel,
    } | {
        action: "setFocus",
        rowIndex: number,
        cellIndex: number,
    } | {
        action: "clearFocus",
    } | {
        action: "clearSelection",
    } | {
        action: "selectRange",
        startRow: number,
        startCell: number,
        endRow: number,
        endCell: number,
        clear?: boolean,
        draft?: boolean,
        replace?: boolean,
    } | {
        action: "excludeRange",
        startRow: number,
        startCell: number,
        endRow: number,
        endCell: number,
        draft?: boolean,
    } | {
        action: "commitDraft",
    }
    >
];

export function tableSelectionReducer(model: TableSelectionReducer[0], action: Parameters<TableSelectionReducer[1]>[0]): TableSelectionReducer[0] {
    const tableSelection = model.file.tableSelection as TableSelection;
    switch (action.action) {
        case "update":
            return {...model, file: action.file};
        case "setFocus":
            tableSelection.setFocus(action.rowIndex, action.cellIndex);
            break;
        case "clearFocus":
            tableSelection.clearFocus();
            break;
        case "clearSelection":
            tableSelection.clearSelection();
            break;
        case "selectRange":
            if (action.clear) {
                tableSelection.clearSelection();
            }
            if (action.replace) {
                tableSelection.removeRange(action.startRow, action.startCell);
            }
            tableSelection.selectRange(action.startRow, action.startCell, action.endRow, action.endCell, action.draft);
            break;
        case "excludeRange":
            tableSelection.excludeRange(action.startRow, action.startCell, action.endRow, action.endCell, action.draft);
            break;
        case "commitDraft":
            tableSelection.commitDraft();
            break;
    }
    return {...model};
}
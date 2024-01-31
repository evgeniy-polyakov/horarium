import {FileModel} from "@/models/FileModel";
import {Dispatch} from "react";

export const MODE_SELECT = 1;
export const MODE_UNSELECT = 2;
export const MODE_APPEND = 4;
export const MODE_RANGE = 8;
export const MODE_ALL = 16;
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

    exclude(range: SelectionRange): void;
    exclude(rowIndex: number, cellIndex: number): void;
    exclude(rowIndex: number | SelectionRange, cellIndex?: number): void {
        if (typeof rowIndex === "number" && typeof cellIndex === "number") {
            if (this.contains(rowIndex, cellIndex)) {
                this.excluded.push(rowIndex, cellIndex);
            }
        } else if (typeof rowIndex === "object") {
            const range = rowIndex;
            const minRow = Math.min(range.startRow, range.endRow);
            const maxRow = Math.max(range.startRow, range.endRow);
            const minCell = Math.min(range.startCell, range.endCell);
            const maxCell = Math.max(range.startCell, range.endCell);
            for (let row = minRow; row <= maxRow; row++) {
                for (let cell = minCell; cell <= maxCell; cell++) {
                    this.exclude(row, cell);
                }
            }
        }
    }

    expand(endRow: number, endCell: number) {
        this.endRow = endRow;
        this.endCell = endCell;
        this.excluded = [];
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

    private ranges: SelectionRange[] = [];
    // todo make an array of excluded ranges
    private excludedRange?: SelectionRange;
    private focus: [number, number] = [-1, -1];

    contains(rowIndex: number, cellIndex: number) {
        return !this.excludedRange?.contains(rowIndex, cellIndex) && this.ranges.some(it => it.contains(rowIndex, cellIndex));
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
        this.ranges = [];
        this.excludedRange = undefined;
    }

    selectRange(startRow: number, startCell: number, endRow: number, endCell: number) {
        this.excludedRange = undefined;
        const existingRange = this.ranges[this.ranges.length - 1];
        let range: SelectionRange;
        if (existingRange?.isStart(startRow, startCell)) {
            range = existingRange;
            range.expand(endRow, endCell);
        } else {
            range = new SelectionRange(startRow, startCell, endRow, endCell);
            this.ranges.push(range);
        }
        this.swallowRanges(range);
    }

    excludeRange(startRow: number, startCell: number, endRow: number, endCell: number, draft?: boolean) {
        if (draft) {
            this.excludedRange = new SelectionRange(startRow, startCell, endRow, endCell);
        } else if (startRow === endRow && startCell === endCell) {
            this.excludedRange = undefined;
            this.ranges.forEach(it => it.exclude(startRow, startCell));
            this.clearRanges();
        } else {
            this.excludedRange = undefined;
            const range = new SelectionRange(startRow, startCell, endRow, endCell);
            this.ranges.forEach(it => it.exclude(range));
            this.clearRanges();
        }
    }

    private swallowRanges(range: SelectionRange) {
        this.ranges.forEach(it => {
            if (it !== range) {
                it.exclude(range);
            }
        })
        this.clearRanges();
    }

    private clearRanges() {
        this.ranges = this.ranges.filter(it => !it.isEmpty());
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
        clear?: boolean,
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
    } | {
        action: "excludeRange",
        startRow: number,
        startCell: number,
        endRow: number,
        endCell: number,
        draft?: boolean,
    }
    >
];

export function tableSelectionReducer(model: TableSelectionReducer[0], action: Parameters<TableSelectionReducer[1]>[0]): TableSelectionReducer[0] {
    const tableSelection = model.file.tableSelection as TableSelection;
    switch (action.action) {
        case "update":
            return {...model, file: action.file};
        case "setFocus":
            if (action.clear) {
                tableSelection.clearSelection();
            }
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
            tableSelection.selectRange(action.startRow, action.startCell, action.endRow, action.endCell);
            break;
        case "excludeRange":
            tableSelection.excludeRange(action.startRow, action.startCell, action.endRow, action.endCell, action.draft);
            break;
    }
    return {...model};
}
import {FileModel} from "@/models/FileModel";
import {Dispatch} from "react";

export const MODE_SELECT = 1;
export const MODE_UNSELECT = 2;
export const MODE_APPEND = 4;
export const MODE_RANGE = 8;
export const MODE_ALL = 16;

class SelectionRange {

    private excluded: number[] = [];

    constructor(
        private readonly startRow: number,
        private readonly startCell: number,
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

    private inRange(rowIndex: number, cellIndex: number) {
        return (this.startRow <= this.endRow ? rowIndex >= this.startRow && rowIndex <= this.endRow : rowIndex <= this.startRow && rowIndex >= this.endRow) &&
            (this.startCell <= this.endCell ? cellIndex >= this.startCell && cellIndex <= this.endCell : cellIndex <= this.startCell && cellIndex >= this.endCell);
    }
}

export class TableSelection {

    private ranges: SelectionRange[] = [];

    contains(rowIndex: number, cellIndex: number) {
        return this.ranges.some(it => it.contains(rowIndex, cellIndex));
    }

    toggleSelection(rowIndex: number, cellIndex: number, mode: number) {
        if (mode & MODE_ALL) {
            this.ranges = [new SelectionRange(0, 0, rowIndex, cellIndex)];
        } else if ((mode & MODE_RANGE) && (mode & MODE_APPEND)) {
            if (this.ranges.length === 0) {
                this.ranges.push(new SelectionRange(rowIndex, cellIndex, rowIndex, cellIndex));
            } else {
                const range = this.ranges[this.ranges.length - 1];
                range.expand(rowIndex, cellIndex);
                this.swallowRanges(range);
            }
        } else if (mode & MODE_RANGE) {
            if (this.ranges.length === 0) {
                this.ranges.push(new SelectionRange(rowIndex, cellIndex, rowIndex, cellIndex));
            } else {
                this.ranges[this.ranges.length - 1].expand(rowIndex, cellIndex);
                this.ranges = this.ranges.slice(-1);
            }
        } else if (mode & MODE_APPEND) {
            if (mode & MODE_SELECT) {
                const range = new SelectionRange(rowIndex, cellIndex, rowIndex, cellIndex);
                this.ranges.push(range);
                this.swallowRanges(range);
            } else {
                this.ranges.forEach(it => it.exclude(rowIndex, cellIndex));
                this.clearRanges();
            }
        } else {
            this.ranges = [new SelectionRange(rowIndex, cellIndex, rowIndex, cellIndex)];
        }
    }

    swallowRanges(range: SelectionRange) {
        this.ranges.forEach(it => {
            if (it !== range) {
                it.exclude(range);
            }
        })
        this.clearRanges();
    }

    clearRanges() {
        this.ranges = this.ranges.filter(it => !it.isEmpty());
    }
}

export type TableSelectionReducer = [
    {
        file: FileModel
    },
    Dispatch<{
        rowIndex: number,
        cellIndex: number,
        mode: number,
    } | {
        file: FileModel,
        mode: "update"
    }>
];

export function tableSelectionReducer(model: TableSelectionReducer[0], action: Parameters<TableSelectionReducer[1]>[0]): TableSelectionReducer[0] {
    if (action.mode === "update") {
        return {...model, file: action.file};
    }
    model.file.cellSelection.toggleSelection(action.rowIndex, action.cellIndex, action.mode);
    return {...model};
}
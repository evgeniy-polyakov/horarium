import {FileModel} from "@/models/FileModel";
import {Dispatch} from "react";
import {Cell} from "@/models/Cell";
import {Range} from "@/models/Range";

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
    private draftIncluded?: SelectionRange;
    private draftExcluded?: SelectionRange;
    private draftInserted?: Range;
    private focus: Cell = [-1, -1];

    contains(rowIndex: number, cellIndex: number) {
        return !this.draftExcluded?.contains(rowIndex, cellIndex) &&
            (this.draftIncluded?.contains(rowIndex, cellIndex) || this.ranges.some(it => it.contains(rowIndex, cellIndex)));
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
        this.draftIncluded = undefined;
        this.draftExcluded = undefined;
    }

    selectRange(startRow: number, startCell: number, endRow: number, endCell: number, draft?: boolean) {
        if (draft) {
            this.draftIncluded = new SelectionRange(startRow, startCell, endRow, endCell);
        } else {
            const range = new SelectionRange(startRow, startCell, endRow, endCell);
            this.ranges.push(range);
            this.combineRanges(range);
        }
    }

    removeRange(startRow: number, startCell: number) {
        this.ranges = this.ranges.filter(it => !it.isStart(startRow, startCell));
    }

    excludeRange(startRow: number, startCell: number, endRow: number, endCell: number, draft?: boolean) {
        if (draft) {
            this.draftExcluded = new SelectionRange(startRow, startCell, endRow, endCell);
        } else {
            const range = new SelectionRange(startRow, startCell, endRow, endCell);
            this.ranges.forEach(it => it.exclude(range));
            this.clearRanges();
        }
    }

    commitDraft() {
        if (this.draftIncluded) {
            this.ranges.push(this.draftIncluded);
            this.combineRanges(this.draftIncluded);
            this.draftIncluded = undefined;
        }
        if (this.draftExcluded) {
            this.ranges.forEach(it => it.exclude(this.draftExcluded!));
            this.clearRanges();
            this.draftExcluded = undefined;
        }
        if (this.draftInserted) {
            // todo
            this.draftInserted = undefined;
        }
    }

    insertRow(rowIndex: number, rows?: number) {
        this.draftInserted = [rowIndex, -1, rows ?? 1, -1];
    }

    insertColumn(columnIndex: number, columns?: number) {
        this.draftInserted = [-1, columnIndex, -1, columns ?? 1];
    }

    private combineRanges(range: SelectionRange) {
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
    } | {
        action: "clearFocus",
    } | {
        action: "clearSelection",
    } | {
        action: "selectRange",
        range: Cell | Range,
        clear?: boolean,
        draft?: boolean,
        replace?: boolean,
    } | {
        action: "excludeRange",
        range: Cell | Range,
        draft?: boolean,
    } | {
        action: "commitDraft",
    } | {
        action: "insertRow",
        rowIndex: number,
        rows?: number,
    } | {
        action: "insertColumn",
        columnIndex: number,
        columns?: number,
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
                tableSelection.removeRange(action.range[0], action.range[1]);
            }
            if (action.range.length > 2) {
                tableSelection.selectRange(...action.range as Range, action.draft);
            } else {
                tableSelection.selectRange(...action.range as Cell, ...action.range as Cell, action.draft);
            }
            break;
        case "excludeRange":
            if (action.range.length > 2) {
                tableSelection.excludeRange(...action.range as Range, action.draft);
            } else {
                tableSelection.excludeRange(...action.range as Cell, ...action.range as Cell, action.draft);
            }
            break;
        case "commitDraft":
            tableSelection.commitDraft();
            break;
        case "insertRow":
            tableSelection.insertRow(action.rowIndex, action.rows);
            break;
        case "insertColumn":
            tableSelection.insertColumn(action.columnIndex, action.columns);
            break;
    }
    return {...model};
}
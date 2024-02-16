import {FileModel} from "@/models/FileModel";
import {Dispatch} from "react";
import {Cell} from "@/models/Cell";
import {Range} from "@/models/Range";
import {CSV} from "@/models/CSV";

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

    expand(endRow: number, endCell: number) {
        this.endRow = endRow;
        this.endCell = endCell;
    }

    exclude(range: SelectionRange): void;
    exclude(rowIndex: number, cellIndex: number): void;
    exclude(minRow: number, minCell: number, maxRow: number, maxCell: number): void;
    exclude(rowIndex: number | SelectionRange, cellIndex?: number, maxRowIndex?: number, maxCellIndex?: number): void {
        if (typeof rowIndex === "number" && typeof cellIndex === "number" && maxRowIndex === undefined && maxCellIndex === undefined) {
            if (this.contains(rowIndex, cellIndex)) {
                this.excluded.push(rowIndex, cellIndex);
            }
        } else {
            const isRange = typeof rowIndex === "object";
            const minRow = isRange ? rowIndex.minRow : rowIndex;
            const maxRow = isRange ? rowIndex.maxRow : maxRowIndex ?? rowIndex;
            const minCell = isRange ? rowIndex.minCell : cellIndex!;
            const maxCell = isRange ? rowIndex.maxCell : maxCellIndex ?? cellIndex!;
            for (let row = minRow; row <= maxRow; row++) {
                for (let cell = minCell; cell <= maxCell; cell++) {
                    this.exclude(row, cell);
                }
            }
        }
    }

    insert(rowIndex: number, columnIndex: number, rows: number, columns: number) {
        let minRow = this.minRow;
        let maxRow = this.maxRow;
        let minCell = this.minCell;
        let maxCell = this.maxCell;
        let empty = false;
        if (rows !== 0) {
            if (rows < 0 && minRow >= rowIndex && minRow < rowIndex - rows) {
                minRow = rowIndex;
            } else if (minRow >= rowIndex) {
                minRow += rows;
            }
            if (maxRow >= rowIndex) {
                maxRow += rows;
            }
            for (let i = 0; i < this.excluded.length; i += 2) {
                let row = this.excluded[i];
                if (rows < 0 && row >= rowIndex && row < rowIndex - rows) {
                    row = -1;
                } else if (row >= rowIndex) {
                    row += rows;
                }
                this.excluded[i] = row;
            }
            if (minRow > maxRow) {
                maxRow = minRow;
                empty = true;
            }
        }
        if (columns !== 0) {
            if (columns < 0 && minCell >= columnIndex && minCell < columnIndex - columns) {
                minCell = columnIndex;
            } else if (minCell >= columnIndex) {
                minCell += columns;
            }
            if (maxCell >= columnIndex) {
                maxCell += columns;
            }
            for (let i = 1; i < this.excluded.length; i += 2) {
                let cell = this.excluded[i];
                if (columns < 0 && cell >= columnIndex && cell < columnIndex - columns) {
                    cell = -1;
                } else if (cell >= columnIndex) {
                    cell += columns;
                }
                this.excluded[i] = cell;
            }
            if (minCell > maxCell) {
                maxCell = minCell;
                empty = true;
            }
        }
        const minMaxRow = this.startRow <= this.endRow;
        this.startRow = minMaxRow ? minRow : maxRow;
        this.endRow = minMaxRow ? maxRow : minRow;
        const minMaxCell = this.startCell <= this.endCell;
        this.startCell = minMaxCell ? minCell : maxCell;
        this.endCell = minMaxCell ? maxCell : minCell;
        const excluded = [...this.excluded];
        this.excluded = [];
        for (let i = 0; i < excluded.length; i += 2) {
            this.exclude(excluded[i], excluded[i + 1]);
        }
        if (empty) {
            this.exclude(minRow, minCell, maxRow, maxCell);
        }
    }

    isEmpty() {
        return this.excluded.length >= (1 + Math.abs(this.startRow - this.endRow)) * (1 + Math.abs(this.startCell - this.endCell)) * 2;
    }

    isStart(rowIndex: number, cellIndex: number) {
        return this.startRow === rowIndex && this.startCell === cellIndex;
    }

    private inRange(rowIndex: number, cellIndex: number) {
        return (this.startRow <= this.endRow ? rowIndex >= this.startRow && rowIndex <= this.endRow : rowIndex <= this.startRow && rowIndex >= this.endRow) &&
            (this.startCell <= this.endCell ? cellIndex >= this.startCell && cellIndex <= this.endCell : cellIndex <= this.startCell && cellIndex >= this.endCell);
    }

    get minRow() {
        return Math.min(this.startRow, this.endRow);
    }

    get maxRow() {
        return Math.max(this.startRow, this.endRow);
    }

    get minCell() {
        return Math.min(this.startCell, this.endCell);
    }

    get maxCell() {
        return Math.max(this.startCell, this.endCell);
    }
}

export interface ITableSelection extends Iterable<Cell> {
    contains(rowIndex: number, cellIndex: number): boolean;
    isFocus(rowIndex: number, cellIndex: number): boolean;
    hasFocus(): boolean;
    readonly focusRow: number;
    readonly focusCell: number;
    copyCells(csv: CSV): CSV;
    pasteCells(csv: CSV, value: CSV, rowIndex: number, cellIndex: number): void;
    clearCells(csv: CSV, value?: string): void;
    clear(): void;
}

export class TableSelection implements ITableSelection {

    private ranges: SelectionRange[] = [];
    private draftIncluded?: SelectionRange;
    private draftExcluded?: SelectionRange;
    private draftInserted?: Range;
    private readonly focus: Cell = [-1, -1];

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
        this.draftInserted = undefined;
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

    expandRange(startRow: number, startCell: number, endRow: number, endCell: number, clear?: boolean) {
        let range = this.ranges.pop() ?? new SelectionRange(startRow, startCell, endRow, endCell);
        range.expand(endRow, endCell);
        if (clear) {
            this.clearSelection();
        }
        this.ranges.push(range);
        this.combineRanges(range);
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
            const [rowIndex, columnIndex, rows, columns] = this.draftInserted;
            let [focusRow, focusColumn] = this.focus;
            if (rowIndex >= 0) {
                if (rows < 0 && focusRow >= rowIndex && focusRow < rowIndex - rows) focusRow = -1;
                else if (focusRow >= rowIndex) focusRow += rows;
            }
            if (columnIndex >= 0) {
                if (columns < 0 && focusColumn >= columnIndex && focusColumn < columnIndex - columns) focusColumn = -1;
                else if (focusColumn >= columnIndex) focusColumn += columns;
            }
            this.focus[0] = focusRow;
            this.focus[1] = focusColumn;
            this.ranges.forEach(it => it.insert(rowIndex, columnIndex, rows, columns));
            this.clearRanges();
            this.draftInserted = undefined;
        }
    }

    insertRow(rowIndex: number, rows?: number) {
        this.draftInserted = [rowIndex, -1, rows ?? 1, 0];
    }

    insertColumn(columnIndex: number, columns?: number) {
        this.draftInserted = [-1, columnIndex, 0, columns ?? 1];
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

    private getBounds() {
        const bounds: Range = [-1, -1, -1, -1];
        for (const range of this.ranges) {
            if (bounds[0] === -1 || bounds[0] > range.minRow) bounds[0] = range.minRow;
            if (bounds[1] === -1 || bounds[1] > range.minCell) bounds[1] = range.minCell;
            if (bounds[2] === -1 || bounds[2] < range.maxRow) bounds[2] = range.maxRow;
            if (bounds[3] === -1 || bounds[3] < range.maxCell) bounds[3] = range.maxCell;
        }
        return bounds;
    }

    * [Symbol.iterator]() {
        const [minRow, minCell, maxRow, maxCell] = this.getBounds();
        let yieldAny = false;
        if (minRow >= 0 && minCell >= 0) {
            const cell: Cell = [-1, -1];
            for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
                for (let cellIndex = minCell; cellIndex <= maxCell; cellIndex++) {
                    if (this.contains(rowIndex, cellIndex)) {
                        cell[0] = rowIndex;
                        cell[1] = cellIndex;
                        yieldAny = true;
                        yield cell;
                    }
                }
            }
        }
        if (!yieldAny && this.hasFocus()) {
            yield [this.focusRow, this.focusCell] as Cell;
        }
    }

    copyCells(csv: CSV) {
        const selectionCsv: CSV = [];
        let startRow = -1;
        let startCell = -1;
        let maxCell = -1;
        for (const [rowIndex, cellIndex] of this) {
            if (startRow < 0) startRow = rowIndex;
            if (startCell < 0) startCell = cellIndex;
            if (cellIndex > maxCell) maxCell = cellIndex;
            if (csv[rowIndex]?.[cellIndex] !== undefined) {
                if (selectionCsv[rowIndex - startRow] === undefined) {
                    selectionCsv[rowIndex - startRow] = [];
                }
                selectionCsv[rowIndex - startRow][cellIndex - startCell] = csv[rowIndex][cellIndex];
            }
        }
        for (let i = 0; i < selectionCsv.length; i++) {
            selectionCsv[i] ??= [];
            for (let j = 0; j < maxCell; j++) {
                selectionCsv[i][j] ??= "";
            }
        }
        return selectionCsv;
    }

    pasteCells(csv: CSV, value: CSV, rowIndex: number, cellIndex: number) {
        const startRows = csv.length;
        const startCells = csv[0].length;
        for (let i = 0; i < value.length; i++) {
            csv[i + rowIndex] ??= [];
            for (let j = 0; j < value[i].length; j++) {
                if (value[i][j] !== "" && value[i][j] !== undefined) {
                    csv[i + rowIndex][j + cellIndex] = value[i][j];
                }
            }
        }
        for (let i = 0; i < rowIndex + value.length; i++) {
            csv[i] ??= [];
            for (let j = 0; j < cellIndex + value[0]?.length; j++) {
                csv[i][j] ??= "";
            }
        }
    }

    clearCells(csv: CSV, value = "") {
        for (const [rowIndex, cellIndex] of this) {
            if (csv[rowIndex]?.[cellIndex] !== undefined) {
                csv[rowIndex][cellIndex] = value;
            }
        }
    }

    clear() {
        this.clearSelection();
        this.clearFocus();
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
        action: "expandRange",
        range: Cell | Range,
        clear?: boolean,
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
        case "expandRange":
            if (action.range.length > 2) {
                tableSelection.expandRange(...action.range as Range, action.clear);
            } else {
                tableSelection.expandRange(...action.range as Cell, ...action.range as Cell, action.clear);
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
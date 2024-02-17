import {State} from "@/models/State";
import {CSV} from "@/models/CSV";
import {TableSelectionReducer} from "@/models/TableSelection";
import {ClearCellsAction, CloneColumnAction, CloneRowAction, ColumnMenuGroup, CopyCellsAction, CutCellsAction, DeleteColumnAction, DeleteRowAction, EditCellAction, InsertColumnAction, InsertRowAction, MenuSeparator, MoveColumnAction, MoveRowAction, PasteCellsAction, RowMenuGroup} from "@/components/TableActions";
import {Cell} from "@/models/Cell";
import {KeyboardEvent} from "react";
import {Key} from "@/models/Key";
import {IMenuItem} from "@/components/IMenuItem";

export class TableCellMenuBuilder {

    constructor(private readonly csvState: State<CSV>,
                private readonly cellEditState: State<Cell>,
                private readonly selectionReducer: TableSelectionReducer) {
    }

    private getRowItems(rowIndex: number) {
        return [
            new CloneRowAction(this.csvState, this.selectionReducer, rowIndex),
            new InsertRowAction(this.csvState, this.selectionReducer, rowIndex, true),
            new InsertRowAction(this.csvState, this.selectionReducer, rowIndex, false),
            new MenuSeparator(),
            new MoveRowAction(this.csvState, this.selectionReducer, rowIndex, true),
            new MoveRowAction(this.csvState, this.selectionReducer, rowIndex, false),
            new MenuSeparator(),
            new DeleteRowAction(this.csvState, this.selectionReducer, rowIndex),
        ];
    }

    private getColumnItems(cellIndex: number) {
        return [
            new CloneColumnAction(this.csvState, this.selectionReducer, cellIndex),
            new InsertColumnAction(this.csvState, this.selectionReducer, cellIndex, true),
            new InsertColumnAction(this.csvState, this.selectionReducer, cellIndex, false),
            new MenuSeparator(),
            new MoveColumnAction(this.csvState, this.selectionReducer, cellIndex, true),
            new MoveColumnAction(this.csvState, this.selectionReducer, cellIndex, false),
            new MenuSeparator(),
            new DeleteColumnAction(this.csvState, this.selectionReducer, cellIndex),
        ];
    }

    buildMenu(rowIndex: number, cellIndex: number): IMenuItem[] {
        return rowIndex >= 0 && cellIndex >= 0 ? [
            new EditCellAction(this.cellEditState, rowIndex, cellIndex),
            new MenuSeparator(),
            new CutCellsAction(this.csvState, this.selectionReducer, rowIndex, cellIndex),
            new CopyCellsAction(this.csvState, this.selectionReducer, rowIndex, cellIndex),
            new PasteCellsAction(this.csvState, this.selectionReducer, rowIndex, cellIndex),
            new ClearCellsAction(this.csvState, this.selectionReducer, rowIndex, cellIndex),
            new MenuSeparator(),
            new RowMenuGroup(this.getRowItems(rowIndex)),
            new ColumnMenuGroup(this.getColumnItems(cellIndex)),
        ] : rowIndex >= 0 ? this.getRowItems(rowIndex) :
            cellIndex >= 0 ? this.getColumnItems(cellIndex) : [];
    }

    keyAction(e: KeyboardEvent, rowIndex: number, cellIndex: number): IMenuItem | undefined {
        const key = e.key;
        if (key === Key.Delete && e.ctrlKey && e.shiftKey) {
            return new DeleteColumnAction(this.csvState, this.selectionReducer, cellIndex);
        } else if (key === Key.Delete && e.ctrlKey) {
            return new DeleteRowAction(this.csvState, this.selectionReducer, rowIndex);
        } else if (key === Key.Delete) {
            return new ClearCellsAction(this.csvState, this.selectionReducer, rowIndex, cellIndex);
        } else if (key === Key.c && e.ctrlKey) {
            return new CopyCellsAction(this.csvState, this.selectionReducer, rowIndex, cellIndex);
        } else if (key === Key.x && e.ctrlKey) {
            return new CutCellsAction(this.csvState, this.selectionReducer, rowIndex, cellIndex);
        } else if (key === Key.v && e.ctrlKey) {
            return new PasteCellsAction(this.csvState, this.selectionReducer, rowIndex, cellIndex);
        } else if (key === Key.D && e.ctrlKey && e.shiftKey) {
            return new CloneColumnAction(this.csvState, this.selectionReducer, cellIndex);
        } else if (key === Key.d && e.ctrlKey) {
            return new CloneRowAction(this.csvState, this.selectionReducer, rowIndex);
        } else if (key === Key.Insert && e.shiftKey) {
            return new InsertColumnAction(this.csvState, this.selectionReducer, cellIndex, e.ctrlKey);
        } else if (key === Key.Insert) {
            return new InsertRowAction(this.csvState, this.selectionReducer, rowIndex, e.ctrlKey);
        }
        return undefined;
    }
}
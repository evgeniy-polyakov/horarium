import {State} from "@/models/State";
import {CSV} from "@/models/CSV";
import {TableSelectionReducer} from "@/models/TableSelection";
import {ClearCellsAction, CloneColumnAction, CloneRowAction, ColumnMenuGroup, CopyCellsAction, CutCellsAction, DeleteColumnAction, DeleteRowAction, EditCellAction, InsertColumnAction, InsertRowAction, MenuSeparator, MoveColumnAction, MoveRowAction, PasteCellsAction, RowMenuGroup} from "@/components/TableActions";
import {Cell} from "@/models/Cell";

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

    buildMenu(rowIndex: number, cellIndex: number) {
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
}
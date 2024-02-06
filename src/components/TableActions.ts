import {IMenuItem} from "@/components/IMenuItem";
import {faArrowDown, faArrowLeft, faArrowRight, faArrowRightToBracket, faArrowUp, faColumns, faPencil, faTableList} from '@fortawesome/free-solid-svg-icons'
import {faClone, faTrashCan} from '@fortawesome/free-regular-svg-icons'
import {TableSelectionReducer} from "@/models/TableSelection";
import {State} from "@/models/State";
import {Cell} from "@/models/Cell";

export class EditCellAction implements IMenuItem {

    readonly name = "Edit";
    readonly icon = faPencil;

    constructor(private readonly cellEditState: State<Cell>,
                private readonly rowIndex: number,
                private readonly cellIndex: number) {
    }

    select() {
        this.cellEditState[1]([this.rowIndex, this.cellIndex]);
    }
}

export abstract class SelectionMenuItem implements IMenuItem {

    constructor(protected readonly csvState: State<string[][]>,
                protected readonly selectionReducer: TableSelectionReducer,
                protected readonly rowIndex: number,
                protected readonly cellIndex: number) {
    }

    get disabled() {
        const [selection] = this.selectionReducer;
        return !selection.file.tableSelection.contains(this.rowIndex, this.cellIndex);
    }
}

export class ClearCellsAction extends SelectionMenuItem {

    readonly name = "Clear";
    readonly icon = faTrashCan;

    select() {
        const [csv, setCsv] = this.csvState;
        const [selection] = this.selectionReducer;
        for (const [rowIndex, cellIndex] of selection.file.tableSelection) {
            if (csv[rowIndex]?.[cellIndex] !== undefined) {
                csv[rowIndex][cellIndex] = "";
            }
        }
        setCsv([...csv]);
    }
}

export class InsertRowAction implements IMenuItem {

    readonly name = `Insert Row ${this.above ? "Above" : "Below"}`;
    readonly icon = faArrowRightToBracket;
    readonly className = `rotate${this.above ? "-90" : "90"}`;

    constructor(private readonly csvState: State<string[][]>,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly rowIndex: number,
                private readonly above: boolean) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        const index = this.rowIndex + (this.above ? 0 : 1);
        const row = csv[0].map(() => "");
        csv.splice(index, 0, row);
        setCSV([...csv]);
        const [, select] = this.selectionReducer;
        select({action: "insertRow", rowIndex: index});
        select({action: "commitDraft"});
    }
}

export class InsertColumnAction implements IMenuItem {

    readonly name = `Insert Column ${this.before ? "Before" : "After"}`;
    readonly icon = faArrowRightToBracket;
    readonly className = `rotate${this.before ? "180" : "0"}`;

    constructor(private readonly csvState: State<string[][]>,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly columnIndex: number,
                private readonly before: boolean) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        const index = this.columnIndex + (this.before ? 0 : 1);
        for (const row of csv) {
            row.splice(index, 0, "");
        }
        setCSV([...csv]);
        const [, select] = this.selectionReducer;
        select({action: "insertColumn", columnIndex: index});
        select({action: "commitDraft"});
    }
}

export class CloneRowAction implements IMenuItem {

    readonly name = `Clone Row`;
    readonly icon = faClone;

    constructor(private readonly csvState: State<string[][]>,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly rowIndex: number) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        const index = this.rowIndex;
        const row = csv[index].slice();
        csv.splice(index, 0, row);
        setCSV([...csv]);
        const [, select] = this.selectionReducer;
        select({action: "insertRow", rowIndex: index + 1});
        select({action: "commitDraft"});
    }
}

export class CloneColumnAction implements IMenuItem {

    readonly name = `Clone Column`;
    readonly icon = faClone;

    constructor(private readonly csvState: State<string[][]>,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly columnIndex: number) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        const index = this.columnIndex;
        for (const row of csv) {
            row.splice(index, 0, row[index]);
        }
        setCSV([...csv]);
        const [, select] = this.selectionReducer;
        select({action: "insertColumn", columnIndex: index + 1});
        select({action: "commitDraft"});
    }
}

export class MoveRowAction implements IMenuItem {

    readonly name = `Move Row ${this.up ? "Up" : "Down"}`;
    readonly icon = this.up ? faArrowUp : faArrowDown;

    constructor(private readonly csvState: State<string[][]>,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly rowIndex: number,
                private readonly up: boolean) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        const otherIndex = this.rowIndex + (this.up ? -1 : 1);
        const row = csv[this.rowIndex];
        csv[this.rowIndex] = csv[otherIndex];
        csv[otherIndex] = row;
        setCSV([...csv]);
    }

    get disabled() {
        const [csv] = this.csvState;
        return (this.up && this.rowIndex === 0) || (!this.up && this.rowIndex >= csv.length - 1);
    }
}

export class MoveColumnAction implements IMenuItem {

    readonly name = `Move Column ${this.left ? "Left" : "Right"}`;
    readonly icon = this.left ? faArrowLeft : faArrowRight;

    constructor(private readonly csvState: State<string[][]>,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly columnIndex: number,
                private readonly left: boolean) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        const otherIndex = this.columnIndex + (this.left ? -1 : 1);
        for (const row of csv) {
            const cell = row[this.columnIndex];
            row[this.columnIndex] = row[otherIndex];
            row[otherIndex] = cell;
        }
        setCSV([...csv]);
    }

    get disabled() {
        const [csv] = this.csvState;
        return (this.left && this.columnIndex === 0) || (!this.left && this.columnIndex >= csv[0].length - 1);
    }
}

export class DeleteRowAction implements IMenuItem {

    readonly name = "Delete Row";
    readonly icon = faTrashCan;

    constructor(private readonly csvState: State<string[][]>,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly rowIndex: number) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        csv.splice(this.rowIndex, 1);
        setCSV([...csv]);
        const [, select] = this.selectionReducer;
        select({action: "insertRow", rowIndex: this.rowIndex, rows: -1});
        select({action: "commitDraft"});
    }

    get disabled() {
        const [csv] = this.csvState;
        return csv.length < 2;
    }
}

export class DeleteColumnAction implements IMenuItem {

    readonly name = "Delete Column";
    readonly icon = faTrashCan;

    constructor(private readonly csvState: State<string[][]>,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly columnIndex: number) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        for (const row of csv) {
            row.splice(this.columnIndex, 1);
        }
        setCSV([...csv]);
        const [, select] = this.selectionReducer;
        select({action: "insertColumn", columnIndex: this.columnIndex, columns: -1});
        select({action: "commitDraft"});
    }

    get disabled() {
        const [csv] = this.csvState;
        return csv[0].length < 2;
    }
}

export class MenuSeparator implements IMenuItem {
    readonly separator = true;
}

export class RowMenuGroup implements IMenuItem {

    readonly name = "Row";
    readonly icon = faTableList;

    constructor(readonly items: IMenuItem[]) {
    }
}

export class ColumnMenuGroup implements IMenuItem {

    readonly name = "Column";
    readonly icon = faColumns;

    constructor(readonly items: IMenuItem[]) {
    }
}
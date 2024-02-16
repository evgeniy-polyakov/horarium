import {IMenuItem} from "@/components/IMenuItem";
import {faArrowDown, faArrowLeft, faArrowRight, faArrowRightToBracket, faArrowUp, faColumns, faCut, faPencil, faTableList} from '@fortawesome/free-solid-svg-icons'
import {faClone, faCopy, faPaste, faTrashCan} from '@fortawesome/free-regular-svg-icons'
import {TableSelectionReducer} from "@/models/TableSelection";
import {State} from "@/models/State";
import {Cell} from "@/models/Cell";
import {parseCSV, stringifyCSV} from "@/models/CSVParser";
import {CSV} from "@/models/CSV";

export class EditCellAction implements IMenuItem {

    readonly name = "Edit";
    readonly icon = faPencil;
    readonly keys = "F2, Enter";

    constructor(private readonly cellEditState: State<Cell>,
                private readonly rowIndex: number,
                private readonly cellIndex: number) {
    }

    select() {
        this.cellEditState[1]([this.rowIndex, this.cellIndex]);
    }
}

export abstract class SelectionMenuItem implements IMenuItem {

    constructor(protected readonly csvState: State<CSV>,
                protected readonly selectionReducer: TableSelectionReducer,
                protected readonly rowIndex: number,
                protected readonly cellIndex: number) {
    }

    get disabled() {
        const tableSelection = this.selectionReducer[0].file.tableSelection;
        return !tableSelection.contains(this.rowIndex, this.cellIndex) &&
            !tableSelection.isFocus(this.rowIndex, this.cellIndex);
    }
}

export class ClearCellsAction extends SelectionMenuItem {

    readonly name = "Clear";
    readonly icon = faTrashCan;
    readonly keys = "Delete";

    select() {
        const [csv, setCsv] = this.csvState;
        const [selection] = this.selectionReducer;
        selection.file.tableSelection.clearCells(csv);
        setCsv([...csv]);
    }
}

export class CopyCellsAction extends SelectionMenuItem {

    readonly name: string = "Copy";
    readonly icon = faCopy;
    readonly keys: string = "Ctrl + C";

    async select() {
        const [csv, setCsv] = this.csvState;
        const [selection] = this.selectionReducer;
        const selectionCsv = selection.file.tableSelection.copyCells(csv);
        setCsv([...csv]);
        await navigator.clipboard.writeText(await stringifyCSV(selectionCsv));
    }
}

export class CutCellsAction extends CopyCellsAction {

    readonly name = "Cut";
    readonly icon = faCut;
    readonly keys = "Ctrl + X";

    async select() {
        await super.select();
        new ClearCellsAction(this.csvState, this.selectionReducer, this.rowIndex, this.cellIndex).select();
    }
}

export class PasteCellsAction extends SelectionMenuItem {

    readonly name = "Paste";
    readonly icon = faPaste;
    readonly keys = "Ctrl + V";

    async select() {
        const [selection] = this.selectionReducer;
        const text = await navigator.clipboard.readText();
        if (text) {
            const [csv, setCsv] = this.csvState;
            const selectionCSV = await parseCSV(text);
            selection.file.tableSelection.pasteCells(csv, selectionCSV, this.rowIndex, this.cellIndex);
            setCsv([...csv]);
        }
    }

    get disabled() {
        return false;
    }
}

export class InsertRowAction implements IMenuItem {

    readonly name = `Insert Row ${this.above ? "Above" : "Below"}`;
    readonly icon = faArrowRightToBracket;
    readonly className = `rotate${this.above ? "-90" : "90"}`;
    readonly keys = `${this.above ? "Ctrl + " : ""}Insert`;

    constructor(private readonly csvState: State<CSV>,
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
    readonly keys = `${this.before ? "Ctrl + " : ""}Shift + Insert`;

    constructor(private readonly csvState: State<CSV>,
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
    readonly keys = "Ctrl + D";

    constructor(private readonly csvState: State<CSV>,
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
    readonly keys = "Ctrl + Shift + D";

    constructor(private readonly csvState: State<CSV>,
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

    constructor(private readonly csvState: State<CSV>,
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

    constructor(private readonly csvState: State<CSV>,
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
    readonly keys = "Ctrl + Delete";

    constructor(private readonly csvState: State<CSV>,
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
    readonly keys = "Ctrl + Shift + Delete";

    constructor(private readonly csvState: State<CSV>,
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
import {IMenuItem} from "@/components/IMenuItem";
import {faArrowRightToBracket, faClone, faPencil} from '@fortawesome/free-solid-svg-icons'
import {MODE_DOWN, MODE_RIGHT, TableSelectionReducer} from "@/models/TableSelection";
import {State} from "@/models/State";

export class EditCellAction implements IMenuItem {

    readonly name = "Edit Cell";
    readonly icon = faPencil;

    constructor(private readonly cellEditState: State<[number, number]>,
                private readonly rowIndex: number,
                private readonly cellIndex: number) {
    }

    select() {
        this.cellEditState[1]([this.rowIndex, this.cellIndex]);
    }
}

export class InsertRowAction implements IMenuItem {

    readonly name = `Insert Row ${this.above ? "Above" : "Below"}`;
    readonly icon = faArrowRightToBracket;
    readonly className = `insert-row-${this.above ? "above" : "below"}`;

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
        if (this.above) {
            this.selectionReducer[1]({
                mode: MODE_DOWN,
                rowIndex: this.rowIndex,
                cellIndex: -1,
            });
        }
    }
}

export class InsertColumnAction implements IMenuItem {

    readonly name = `Insert Column ${this.before ? "Before" : "After"}`;
    readonly icon = faArrowRightToBracket;
    readonly className = `insert-column-${this.before ? "before" : "after"}`;

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
        if (this.before) {
            this.selectionReducer[1]({
                mode: MODE_RIGHT,
                rowIndex: -1,
                cellIndex: this.columnIndex,
            });
        }
    }
}

export class CloneRowAction implements IMenuItem {

    readonly name = `Clone Row`;
    readonly icon = faClone;

    constructor(private readonly csvState: State<string[][]>,
                private readonly rowIndex: number) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        const index = this.rowIndex;
        const row = csv[index].slice();
        csv.splice(index, 0, row);
        setCSV([...csv]);
    }
}

export class CloneColumnAction implements IMenuItem {

    readonly name = `Clone Column`;
    readonly icon = faClone;

    constructor(private readonly csvState: State<string[][]>,
                private readonly columnIndex: number) {
    }

    select() {
        const [csv, setCSV] = this.csvState;
        const index = this.columnIndex;
        for (const row of csv) {
            row.splice(index, 0, row[index]);
        }
        setCSV([...csv]);
    }
}

export class Separator implements IMenuItem {
    readonly separator = true;
}
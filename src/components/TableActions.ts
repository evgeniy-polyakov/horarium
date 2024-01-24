import {StateAssessor} from "@/models/StateAccessor";
import {IMenuItem} from "@/components/IMenuItem";
import {faArrowRightToBracket, faPencil} from '@fortawesome/free-solid-svg-icons'
import {MODE_DOWN, MODE_RIGHT, TableSelectionReducer} from "@/models/TableSelection";

export class EditCellAction implements IMenuItem {

    readonly name = "Edit Cell";
    readonly icon = faPencil;

    constructor(private readonly cellEdit: StateAssessor<[number, number]>,
                private readonly rowIndex: number,
                private readonly cellIndex: number) {
    }

    select() {
        this.cellEdit.set([this.rowIndex, this.cellIndex]);
    }
}

export class InsertRowAction implements IMenuItem {

    readonly name = `Insert Row ${this.above ? "Above" : "Below"}`;
    readonly icon = faArrowRightToBracket;
    readonly className = `insert-row-${this.above ? "above" : "below"}`;

    constructor(private readonly csv: string[][],
                private readonly setCSV: (value: string[][]) => void,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly rowIndex: number,
                private readonly above: boolean) {
    }

    select() {
        const index = this.rowIndex + (this.above ? 0 : 1);
        const row = this.csv[0].map(() => "");
        this.setCSV([
            ...this.csv.slice(0, index),
            row,
            ...this.csv.slice(index)
        ]);
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

    constructor(private readonly csv: string[][],
                private readonly setCSV: (value: string[][]) => void,
                private readonly selectionReducer: TableSelectionReducer,
                private readonly columnIndex: number,
                private readonly before: boolean) {
    }

    select() {
        const index = this.columnIndex + (this.before ? 0 : 1);
        for (const row of this.csv) {
            row.splice(index, 0, "");
        }
        this.setCSV([...this.csv]);
        if (this.before) {
            this.selectionReducer[1]({
                mode: MODE_RIGHT,
                rowIndex: -1,
                cellIndex: this.columnIndex,
            });
        }
    }
}


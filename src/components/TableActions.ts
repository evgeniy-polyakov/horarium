import {StateAssessor} from "@/models/StateAccessor";
import {IMenuItem} from "@/components/IMenuItem";

export class EditCellAction implements IMenuItem {

    readonly name = "Edit Cell";

    constructor(readonly cellEdit: StateAssessor<[number, number]>, readonly rowIndex: number, readonly cellIndex: number) {
    }

    select() {
        this.cellEdit.set([this.rowIndex, this.cellIndex]);
    }
}

export class InsertRowAction implements IMenuItem {

    readonly name = `Insert Row ${this.sign < 0 ? "Above" : "Below"}`;

    constructor(readonly rowIndex: number, private readonly sign: -1 | 1) {
    }

    select() {
        // todo
    }
}

export class InsertColumnAction implements IMenuItem {

    readonly name = `Insert Column ${this.sign < 0 ? "Before" : "After"}`;

    constructor(readonly columnIndex: number, private readonly sign: -1 | 1) {
    }

    select() {
        // todo
    }
}


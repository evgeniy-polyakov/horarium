import {StateAssessor} from "@/models/StateAccessor";
import {IMenuItem} from "@/components/IMenuItem";
import {faArrowRightToBracket, faPencil} from '@fortawesome/free-solid-svg-icons'

export class EditCellAction implements IMenuItem {

    readonly name = "Edit Cell";
    readonly icon = faPencil;

    constructor(readonly cellEdit: StateAssessor<[number, number]>, readonly rowIndex: number, readonly cellIndex: number) {
    }

    select() {
        this.cellEdit.set([this.rowIndex, this.cellIndex]);
    }
}

export class InsertRowAction implements IMenuItem {

    readonly name = `Insert Row ${this.sign < 0 ? "Above" : "Below"}`;
    readonly icon = faArrowRightToBracket;
    readonly className = `insert-row-${this.sign < 0 ? "above" : "below"}`;
    readonly disabled = true;

    constructor(readonly rowIndex: number, private readonly sign: -1 | 1) {
    }

    select() {
        // todo
    }
}

export class InsertColumnAction implements IMenuItem {

    readonly name = `Insert Column ${this.sign < 0 ? "Before" : "After"}`;
    readonly icon = faArrowRightToBracket;
    readonly className = `insert-column-${this.sign < 0 ? "before" : "after"}`;
    readonly disabled = true;

    constructor(readonly columnIndex: number, private readonly sign: -1 | 1) {
    }

    select() {
        // todo
    }
}


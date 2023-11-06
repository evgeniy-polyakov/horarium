import {ITabItem} from "@/components/ITabItem";
import {AppFile} from "@/models/AppFile";
import router from "@/router";
import {Table} from "@/models/Database";

export class TableTabItem implements ITabItem {

    private _label!: string;
    private _link!: string;
    readonly removable = true;
    readonly editable = true;

    constructor(
        readonly file: AppFile,
        readonly table: Table) {
        this.label = table.name;
    }

    get label() {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        this._link = `/${this.file.filename.toLowerCase()}/${this._label.toLowerCase()}`;
    }

    get link() {
        return this._link;
    }

    get selected() {
        return router.currentRoute.value.params['table'] === this._label.toLowerCase();
    }
}
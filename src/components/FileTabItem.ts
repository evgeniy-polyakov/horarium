import {ITabItem} from "@/components/ITabItem";
import {AppFile} from "@/models/AppFile";
import router from "@/router";

export class FileTabItem implements ITabItem {

    private _label!: string;
    private _link!: string;
    readonly removable = true;
    readonly editable = true;

    constructor(readonly file: AppFile) {
        this.label = file.filename;
    }

    get label() {
        return this._label;
    }

    set label(value: string) {
        this._label = value;
        this._link = `/${this._label.toLowerCase()}`;
    }

    get link() {
        return this._link;
    }

    get selected() {
        return router.currentRoute.value.params['file'] === this._label.toLowerCase();
    }
}
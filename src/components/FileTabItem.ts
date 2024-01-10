import {ITabItem} from "@/components/ITabItem";
import {FileModel} from "@/models/FileModel";

export class FileTabItem implements ITabItem {

    public name;
    readonly removable = true;
    readonly editable = true;

    constructor(readonly file: FileModel) {
        this.name = file.filename;
    }

    get key() {
        return `${this.file.id}`;
    }

    get selected() {
        return this.file.selected;
    }

    get link() {
        return `/${this.name}`;
    }
}
import {ITabItem} from "@/components/ITabItem";
import {FileModel} from "@/models/FileModel";

export class FileTabItem implements ITabItem {

    public name;
    public icon = "";
    readonly removable = true;
    readonly editable = true;

    constructor(readonly file: FileModel) {
        this.name = file.filename;
    }

    get link() {
        return `/${this.name}`;
    }

    get selected() {
        return this.file.selected;
    }
}
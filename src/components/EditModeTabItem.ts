import {ITabItem} from "@/components/ITabItem";
import {EditMode} from "@/models/EditMode";

export class EditModeTabItem implements ITabItem {

    name: string;
    selected = false;

    readonly editable = false;
    readonly removable = false;

    constructor(readonly editMode: EditMode) {
        this.name = editMode;
    }
}
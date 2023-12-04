import {ITabItem} from "@/components/ITabItem";
import {EditMode} from "@/models/EditMode";

export class EditModeTabItem implements ITabItem {

    public name = "";
    public icon: string;
    public selected = false;
    readonly editable = false;
    readonly removable = false;

    constructor(readonly editMode: EditMode,
                icon: string) {
        this.icon = icon;
    }
}
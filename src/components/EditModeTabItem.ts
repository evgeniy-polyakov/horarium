import {ITabItem} from "@/components/ITabItem";
import {EditMode} from "@/models/EditMode";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FileModel} from "@/models/FileModel";

export class EditModeTabItem implements ITabItem {

    readonly key = this.editMode;
    readonly editable = false;
    readonly removable = false;

    constructor(readonly file: FileModel,
                readonly editMode: EditMode,
                readonly icon: IconProp,
                readonly hint: string) {
    }

    get selected() {
        return this.file.editMode === this.editMode;
    }
}
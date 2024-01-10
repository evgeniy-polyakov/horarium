import {FileModel} from "@/models/FileModel";
import {EditMode} from "@/models/EditMode";
import {TextEditor} from "@/components/TextEditor";

export function FileView({file}: {
    file: FileModel
}) {
    return (
        <article>
            {file.editMode === EditMode.Text && <TextEditor file={file}/>}
        </article>
    );
}
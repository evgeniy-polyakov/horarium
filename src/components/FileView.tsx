import {FileModel} from "@/models/FileModel";
import {EditMode} from "@/models/EditMode";
import {TextEditor} from "@/components/TextEditor";
import {TableEditor} from "@/components/TableEditor";

export function FileView({file}: {
    file: FileModel
}) {
    return (
        <article>
            {file.editMode === EditMode.Text && <TextEditor file={file}/>}
            {file.editMode === EditMode.Table && <TableEditor file={file}/>}
        </article>
    );
}
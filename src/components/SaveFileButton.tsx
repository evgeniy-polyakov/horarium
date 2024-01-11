import {IconButton} from "@/components/IconButton";
import {faFileDownload} from '@fortawesome/free-solid-svg-icons'
import {FileModel} from "@/models/FileModel";

export function SaveFileButton({file}: {
    file: FileModel,
}) {
    async function onCLick() {
        await file.save();
    }

    return (
        <IconButton icon={faFileDownload} onClick={onCLick} hint="Save File"/>
    );
}
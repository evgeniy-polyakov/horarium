import {IconButton} from "@/components/IconButton";
import {faFile} from '@fortawesome/free-solid-svg-icons';
import {FileModel} from "@/models/FileModel";

export function NewFileButton({onOpen}: {
    onOpen?: (model: FileModel) => void,
}) {
    async function onCLick() {
        const fileModel = new FileModel();
        await fileModel.load();
        onOpen?.(fileModel);
    }

    return (
        <IconButton icon={faFile} onClick={onCLick} hint="New File"/>
    );
}
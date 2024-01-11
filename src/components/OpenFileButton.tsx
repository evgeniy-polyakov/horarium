import {IconButton} from "@/components/IconButton";
import {faFolderOpen} from '@fortawesome/free-solid-svg-icons';
import {FileModel} from "@/models/FileModel";
import {FileLoaders} from "@/models/FileLoaders";

export function OpenFileButton({onOpen}: {
    onOpen?: (model: FileModel) => void,
}) {
    function onCLick() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.accept = FileLoaders.map(it => `.${it.extension},${it.mimeType}`).join(',');
        input.onchange = async () => {
            if (input.files) {
                for (let i = 0; i < input.files.length; i++) {
                    const fileModel = new FileModel(input.files.item(i)!);
                    await fileModel.load();
                    onOpen?.(fileModel);
                }
            }
        }
        input.click();
    }

    return (
        <IconButton icon={faFolderOpen} onClick={onCLick}/>
    );
}
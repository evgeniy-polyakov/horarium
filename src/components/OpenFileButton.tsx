'use client';

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
        input.accept = FileLoaders.map(it => `.${it.extension},${it.mimeType}`).join(',');
        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const fileModel = new FileModel(file);
                await fileModel.load();
                onOpen?.(fileModel);
            }
        }
        input.click();
    };

    return (
        <IconButton icon={faFolderOpen} onClick={onCLick}/>
    );
}
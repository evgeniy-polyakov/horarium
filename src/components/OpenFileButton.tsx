'use client';

import IconButton from "@/components/IconButton";
import {faFolderOpen} from '@fortawesome/free-solid-svg-icons'
import {FileModel} from "@/models/FileModel";

export default function OpenFileButton(_: {
    onOpen?: (model: FileModel) => void,
}) {
    function onCLick() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,text/csv';
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                _.onOpen?.(new FileModel(file));
            }
        }
        input.click();
    };

    return (
        <IconButton icon={faFolderOpen} onClick={onCLick}/>
    );
}
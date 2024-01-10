'use client';

import OpenFileButton from "@/components/OpenFileButton";
import {faFileDownload} from '@fortawesome/free-solid-svg-icons'
import IconButton from "@/components/IconButton";
import {FilesReducer} from "@/stores/filesReducer";
import {Tabs} from "@/components/Tabs";
import {FileTabItem} from "@/components/FileTabItem";

export default function MainMenu(_: {
    files: FilesReducer
}) {

    return (
        <nav>
            <OpenFileButton onOpen={file => _.files[1]({
                file,
                type: "add"
            })}/>
            <IconButton icon={faFileDownload}/>
            <Tabs items={_.files[0].map(it => new FileTabItem(it))}/>
        </nav>
    );
}
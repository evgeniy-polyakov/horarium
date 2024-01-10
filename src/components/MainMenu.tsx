'use client';

import {OpenFileButton} from "@/components/OpenFileButton";
import {faFileDownload} from '@fortawesome/free-solid-svg-icons'
import {IconButton} from "@/components/IconButton";
import {FilesReducer} from "@/stores/filesReducer";
import {Tabs} from "@/components/Tabs";
import {FileTabItem} from "@/components/FileTabItem";

export function MainMenu({files}: {
    files: FilesReducer
}) {
    return (
        <nav>
            <OpenFileButton onOpen={file => files[1]({
                file,
                type: "add"
            })}/>
            <IconButton icon={faFileDownload}/>
            <Tabs items={files[0].map(it => new FileTabItem(it))}
                  onSelect={item => files[1]({
                      file: item.file,
                      type: "select"
                  })}
                  onRemove={item => files[1]({
                      file: item.file,
                      type: "remove"
                  })}
            />
        </nav>
    );
}
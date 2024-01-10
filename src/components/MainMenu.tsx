'use client';

import {OpenFileButton} from "@/components/OpenFileButton";
import {faFileDownload, faTableList} from '@fortawesome/free-solid-svg-icons'
import {faFileLines} from '@fortawesome/free-regular-svg-icons';
import {IconButton} from "@/components/IconButton";
import {FilesReducer} from "@/stores/filesReducer";
import {Tabs} from "@/components/Tabs";
import {FileTabItem} from "@/components/FileTabItem";
import {EditModeTabItem} from "@/components/EditModeTabItem";
import {EditMode} from "@/models/EditMode";

export function MainMenu({filesReducer}: {
    filesReducer: FilesReducer
}) {
    const [filesModel, fileAction] = filesReducer;
    const files = filesModel.files;
    return (
        <nav>
            <OpenFileButton onOpen={file => fileAction({
                file,
                type: "add"
            })}/>
            <IconButton icon={faFileDownload}/>
            <Tabs items={files.map(it => new FileTabItem(it))}
                  onSelect={item => fileAction({
                      file: item.file,
                      type: "select"
                  })}
                  onRemove={item => fileAction({
                      file: item.file,
                      type: "remove"
                  })}
            />
            {filesModel.selectedFile && <Tabs items={[
                new EditModeTabItem(filesModel.selectedFile, EditMode.Text, faFileLines),
                new EditModeTabItem(filesModel.selectedFile, EditMode.Table, faTableList)
            ]} onSelect={item => {
                filesModel.selectedFile!.editMode = item.editMode;
                fileAction({
                    file: filesModel.selectedFile!,
                    type: "update"
                });
            }}/>}
        </nav>
    );
}
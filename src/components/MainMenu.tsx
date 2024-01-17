import {OpenFileButton} from "@/components/OpenFileButton";
import {faTableList} from '@fortawesome/free-solid-svg-icons'
import {faFileLines} from '@fortawesome/free-regular-svg-icons';
import {FilesReducer} from "@/models/FilesReducer";
import {Tabs} from "@/components/Tabs";
import {FileTabItem} from "@/components/FileTabItem";
import {EditModeTabItem} from "@/components/EditModeTabItem";
import {EditMode} from "@/models/EditMode";
import {SaveFileButton} from "@/components/SaveFileButton";
import {FileModel} from "@/models/FileModel";
import {NewFileButton} from "@/components/NewFileButton";

export function MainMenu({filesReducer}: {
    filesReducer: FilesReducer
}) {
    const [filesModel, fileAction] = filesReducer;
    const files = filesModel.files;
    const file = filesModel.selectedFile;

    function onOpenFile(file: FileModel) {
        fileAction({file, type: "add"});
    }

    return (
        <nav>
            <OpenFileButton onOpen={onOpenFile}/>
            <NewFileButton onOpen={onOpenFile}/>
            {file && <SaveFileButton file={file}/>}
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
            {file && <Tabs items={[
                new EditModeTabItem(file, EditMode.Text, faFileLines, "Text"),
                new EditModeTabItem(file, EditMode.Table, faTableList, "Table"),
            ]} onSelect={item => {
                file.editMode = item.editMode;
                fileAction({
                    file: filesModel.selectedFile!,
                    type: "update"
                });
            }}/>}
        </nav>
    );
}
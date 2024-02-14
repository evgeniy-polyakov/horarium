import {FileModel} from "@/models/FileModel";
import {useState} from "react";

export function TextEditor({file}: {
    file: FileModel
}) {
    const [value, setValue] = useState(file.textContent);
    if (value !== file.textContent) {
        setValue(file.textContent);
    }
    return (
        <textarea className="text-editor" value={value}
                  onChange={e => {
                      file.textContent = e.target.value;
                      file.tableSelection.clear();
                      setValue(e.target.value);
                  }}
                  onScroll={e => {
                      // todo
                  }}/>
    );
}
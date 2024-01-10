import {FileModel} from "@/models/FileModel";
import {Dispatch} from "react";

export type FilesReducer = [
    {
        files: FileModel[],
        selectedFile?: FileModel
    },
    Dispatch<{
        type: "add" | "select" | "remove" | "update",
        file: FileModel
    }>
];

export function filesReducer(model: FilesReducer[0], action: Parameters<FilesReducer[1]>[0]): FilesReducer[0] {
    const files = model.files;
    switch (action.type) {
        case "add":
            files.forEach(it => it.selected = false);
            const existing = files.filter(it => it.filename === action.file.filename)[0];
            if (existing) {
                existing.selected = true;
            } else {
                action.file.selected = true;
                files.push(action.file);
            }
            break;
        case "select":
            files.forEach(it => it.selected = false);
            action.file.selected = true;
            break;
        case "remove":
            const index = files.indexOf(action.file);
            if (index >= 0) {
                files.splice(index, 1);
                if (action.file.selected) {
                    if (index < files.length) {
                        files[index].selected = true;
                    } else if (index - 1 >= 0) {
                        files[index - 1].selected = true;
                    }
                }
            }
            break;
        case "update":
            break;
    }
    return {files, selectedFile: files.filter(it => it.selected)[0]};
}
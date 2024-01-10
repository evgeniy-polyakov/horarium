import {FileModel} from "@/models/FileModel";
import {Dispatch} from "react";

export type FilesReducer = [
    FileModel[],
    Dispatch<{
        type: "add" | "select" | "remove",
        file: FileModel
    }>
];

export function filesReducer(files: FilesReducer[0], action: Parameters<FilesReducer[1]>[0]) {
    switch (action.type) {
        case "add":
            files.forEach(it => it.selected = false);
            const existing = files.filter(it => it.filename === action.file.filename)[0];
            if (existing) {
                existing.selected = true;
                return [...files];
            } else {
                action.file.selected = true;
                return [...files, action.file];
            }
        case "select":
            files.forEach(it => it.selected = false);
            action.file.selected = true;
            return [
                ...files
            ];
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
            return [...files];
    }
}
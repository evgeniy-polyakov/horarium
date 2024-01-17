'use client';

import {MainMenu} from "@/components/MainMenu";
import {useReducer} from "react";
import {filesReducer} from "@/models/FilesReducer";
import {FileView} from "@/components/FileView";

export default function Home() {
    const globalFilesReducer = useReducer(filesReducer, {files: []});
    const [filesModel, filesAction] = globalFilesReducer;
    return (
        <>
            <header>
                <MainMenu filesReducer={globalFilesReducer}/>
            </header>
            <main>
                {filesModel.selectedFile && <FileView file={filesModel.selectedFile}/>}
            </main>
        </>
    )
}

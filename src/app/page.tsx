'use client';

import {MainMenu} from "@/components/MainMenu";
import {useReducer} from "react";
import {filesReducer} from "@/stores/filesReducer";

export default function Home() {
    const files = useReducer(filesReducer, {files: []});
    return (
        <>
            <header>
                <MainMenu filesReducer={files}/>
            </header>
            <main>

            </main>
        </>
    )
}

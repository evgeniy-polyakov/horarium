'use client';

import {MainMenu} from "@/components/MainMenu";
import {useReducer} from "react";
import {filesReducer} from "@/stores/filesReducer";

export default function Home() {
    const files = useReducer(filesReducer, []);
    return (
        <>
            <header>
                <MainMenu files={files}/>
            </header>
            <main>

            </main>
        </>
    )
}

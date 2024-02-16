import {useState} from "react";

export function useKeyDownRepeater(interval?: number) {
    const [repeater] = useState(new KeyDownRepeater());
    return repeater;
}

export class KeyDownRepeater {

    private keyDownTimestamp: Record<string, number> = {};

    constructor(readonly interval = 50) {
    }

    onKeyDown(key: string) {
        const t = new Date().getTime();
        if (this.keyDownTimestamp[key] === undefined || t - this.keyDownTimestamp[key] > this.interval) {
            this.keyDownTimestamp[key] = t;
            return true;
        }
        return false;
    }

    onKeyUp(key: string) {
        delete this.keyDownTimestamp[key];
    }
}
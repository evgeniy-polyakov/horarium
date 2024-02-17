import {useState} from "react";

export function useKeyDownRepeater(interval?: number) {
    const [repeater] = useState(new KeyDownRepeater());
    return repeater;
}

export class KeyDownRepeater {

    private keyDownTimestamp: Record<string, number> = {};

    constructor(readonly interval: number | Record<string, number> = 60) {
        window.addEventListener("keyup", e => {
            delete this.keyDownTimestamp[e.key];
        });
    }

    isKeyDown(key: string, once = false) {
        const t = new Date().getTime();
        const interval = typeof this.interval === "number" ? this.interval : this.interval[key] ?? Number.POSITIVE_INFINITY;
        if (this.keyDownTimestamp[key] === undefined || (!once && t - this.keyDownTimestamp[key] > interval)) {
            this.keyDownTimestamp[key] = t;
            return true;
        }
        return false;
    }
}
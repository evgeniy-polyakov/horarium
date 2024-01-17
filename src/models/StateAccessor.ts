import {useState} from "react";

export interface StateAssessor<T> {
    get(): T;
    set(value: T): void;
}

export function useStateAccessor<T>(value: T | { (): T }): StateAssessor<T> {
    const state = useState(value);
    return {
        get() {
            return state[0];
        },
        set(value: T) {
            state[1](value);
        }
    }
}
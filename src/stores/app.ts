import {defineStore} from 'pinia'
import {FileTabItem} from "@/components/FileTabItem";
import {reactive, shallowReactive, watch} from "vue";

export const useAppStore = defineStore('app', () => {

    const fileTabItems = reactive<FileTabItem[]>([]);
    const getSelectedFile = () => fileTabItems.filter(it => it.selected)[0]?.file;

    const fileState = shallowReactive<Record<string, unknown>>({});
    const getFileStateKey = (name: string) => {
        return `${getSelectedFile()?.id ?? ''}:${name}`;
    }
    const getFileState = <T>(name: string, defaultValue?: T): T => {
        return fileState[getFileStateKey(name)] as T ?? defaultValue!;
    };
    const setFileState = (name: string, value: unknown) => {
        fileState[getFileStateKey(name)] = value;
    };
    const watchFileState = (name: string, watcher: (value: unknown) => void) => {
        return watch(
            () => fileState[getFileStateKey(name)],
            watcher,
            {immediate: true}
        )
    };

    return {fileTabItems, getSelectedFile, getFileState, setFileState, watchFileState};
});

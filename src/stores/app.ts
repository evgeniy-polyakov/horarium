import {defineStore} from 'pinia'
import {FileTabItem} from "@/components/FileTabItem";
import {reactive, watch} from "vue";
import {FileModel} from "@/models/FileModel";

export const useAppStore = defineStore('app', () => {
    const fileTabItems = reactive<FileTabItem[]>([]);
    const selectedFileWatchers: { (file: FileModel): void }[] = [];

    const getSelectedFile = () => fileTabItems.filter(it => it.selected)[0]?.file as FileModel;

    watch(
        getSelectedFile,
        file => {
            if (file) {
                selectedFileWatchers.forEach(it => it(file as FileModel));
            }
        });

    const watchSelectedFile = (watcher: (file: FileModel) => void) => {
        if (selectedFileWatchers.indexOf(watcher) < 0) {
            selectedFileWatchers.push(watcher);
            const file = getSelectedFile();
            if (file) {
                watcher(file);
            }
        }
    };

    return {fileTabItems, watchSelectedFile, getSelectedFile};
});

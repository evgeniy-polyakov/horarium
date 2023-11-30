import {defineStore} from 'pinia'
import {FileTabItem} from "@/components/FileTabItem";
import {reactive} from "vue";

export const useAppStore = defineStore('app', () => {
    const fileTabItems = reactive<FileTabItem[]>([]);
    const getSelectedFile = () => fileTabItems.filter(it => it.selected)[0]?.file;

    return {fileTabItems, getSelectedFile};
});

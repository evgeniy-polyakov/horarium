import {defineStore} from 'pinia'
import {FileTabItem} from "@/components/FileTabItem";
import {reactive} from "vue";

export const useAppStore = defineStore('app', () => {
    const fileTabItems = reactive<FileTabItem[]>([]);
    return {fileTabItems};
})

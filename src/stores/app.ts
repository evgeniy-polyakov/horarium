import {defineStore} from 'pinia'
import {FileTabItem} from "@/components/FileTabItem";
import {reactive, ref, watch} from "vue";
import {FileModel} from "@/models/FileModel";

export const useAppStore = defineStore('app', () => {
    const fileTabItems = reactive<FileTabItem[]>([]);
    const selectedFile = ref<FileModel>();

    watch(
        () => fileTabItems.filter(it => it.selected)[0]?.file,
        file => {
            selectedFile.value = file as FileModel;
        });

    return {fileTabItems, selectedFile};
});

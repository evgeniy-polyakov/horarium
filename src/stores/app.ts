import {defineStore} from 'pinia'
import {FileTabItem} from "@/components/FileTabItem";
import {reactive, watch} from "vue";
import {useRoute} from "vue-router";
import {TableTabItem} from "@/components/TableTabItem";
import {AppFile} from "@/models/AppFile";

export const useAppStore = defineStore('app', () => {
    const fileTabItems = reactive<FileTabItem[]>([]);
    const tableTabItems = reactive<TableTabItem[]>([]);

    const route = useRoute();
    watch(
        () => route.fullPath,
        () => {
            const fileTab = fileTabItems.filter(it => it.selected)[0];
            tableTabItems.splice(0, tableTabItems.length);
            if (fileTab) {
                tableTabItems.push(...fileTab.file.database.getTables().map(table => new TableTabItem(fileTab.file as AppFile, table)));
            }
        }
    );

    return {fileTabItems, tableTabItems};
})

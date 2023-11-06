import {defineStore} from 'pinia'
import {FileTabItem} from "@/components/FileTabItem";
import {reactive, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {TableTabItem} from "@/components/TableTabItem";
import {AppFile} from "@/models/AppFile";

export const useAppStore = defineStore('app', () => {
    const fileTabItems = reactive<FileTabItem[]>([]);
    const tableTabItems = reactive<TableTabItem[]>([]);
    const selectedFileTab = ref<FileTabItem | undefined>(undefined);

    const route = useRoute();
    watch(
        () => route.fullPath,
        () => {
            const selectedFileTabValue = fileTabItems.filter(it => it.selected)[0];
            selectedFileTab.value = selectedFileTabValue;
            tableTabItems.splice(0, tableTabItems.length);
            if (selectedFileTabValue) {
                tableTabItems.push(...selectedFileTabValue.file.database.getTables().map(table => new TableTabItem(selectedFileTabValue.file as AppFile, table)));
            }
        }
    );

    return {fileTabItems, selectedFileTab, tableTabItems};
})

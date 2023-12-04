<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import IconButton from "@/components/IconButton.vue";
import OpenFileButton from "@/components/OpenFileButton.vue";
import {FileModel} from "@/models/FileModel";
import {FileTabItem} from "@/components/FileTabItem";
import router from "@/router";
import {useAppStore} from "@/stores/app";
import {reactive, watch} from "vue";
import {EditModeTabItem} from "@/components/EditModeTabItem";
import {EditMode} from "@/models/EditMode";

const store = useAppStore();
const fileItems = store.fileTabItems;
const modeItems = reactive([
  new EditModeTabItem(EditMode.Text, 'file-lines:regular'),
  new EditModeTabItem(EditMode.Table, 'table-list'),
]);

const onOpenFile = async (file: FileModel) => {
  let item = fileItems.filter(it => it.file.filename === file.filename)[0];
  if (!item) {
    await file.load();
    item = new FileTabItem(file);
    fileItems.push(item);
  }
  await router.push(item.link);
};

const onSelectFile = (index: number) => {
  const url = fileItems[index]?.link;
  if (url && router.currentRoute.value.fullPath !== url) {
    router.push(url);
  }
};

const onRemoveFile = (index: number) => {
  fileItems.splice(index, 1);
  if (fileItems.length === 0) {
    router.replace('/');
  } else if (!fileItems.some(it => it.selected)) {
    index = Math.min(index, fileItems.length - 1);
    router.replace(fileItems[index].link);
  }
};

const onRenameFile = (index: number, value: string) => {
  if (value && fileItems[index]) {
    const item = fileItems[index];
    if (item) {
      item.name = value;
      router.replace(item.link);
    }
  }
};

watch(router.currentRoute, (value) => {
  fileItems.forEach(it => it.selected = decodeURIComponent(value.path) === it.link);
});

watch(store.getSelectedFile, file => {
  if (file) {
    document.title = `Tabula - ${file.filename}`;
  } else {
    document.title = 'Tabula';
  }
});

const onSelectEditMode = (index: number) => {
  store.setFileState('EditMode', modeItems[index].editMode);
};

watch(store.getSelectedFile, file => {
  const editMode = store.getFileState('EditMode', EditMode.Text);
  modeItems.forEach(it => it.selected = it.editMode === editMode);
});

</script>

<template>
  <OpenFileButton @open="onOpenFile"/>
  <IconButton icon="file-download"/>
  <Tabs :items="fileItems" fixed
        @select-tab="onSelectFile"
        @remove-tab="onRemoveFile"
        @rename-tab="onRenameFile"/>
  <Tabs :items="modeItems" fixed
        @select-tab="onSelectEditMode"/>
</template>
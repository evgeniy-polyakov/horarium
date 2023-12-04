<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import IconButton from "@/components/IconButton.vue";
import OpenFileButton from "@/components/OpenFileButton.vue";
import {FileModel} from "@/models/FileModel";
import {FileTabItem} from "@/components/FileTabItem";
import router from "@/router";
import {useAppStore} from "@/stores/app";
import {watch} from "vue";

const store = useAppStore();
const items = store.fileTabItems;

const onOpenFile = async (file: FileModel) => {
  let item = items.filter(it => it.file.filename === file.filename)[0];
  if (!item) {
    await file.load();
    item = new FileTabItem(file);
    items.push(item);
  }
  await router.push(item.link);
};

const onSelectFile = (index: number) => {
  const url = items[index]?.link;
  if (url && router.currentRoute.value.fullPath !== url) {
    router.push(url);
  }
};

const onRemoveFile = (index: number) => {
  items.splice(index, 1);
  if (items.length === 0) {
    router.replace('/');
  } else if (!items.some(it => it.selected)) {
    index = Math.min(index, items.length - 1);
    router.replace(items[index].link);
  }
};

const onRenameFile = (index: number, value: string) => {
  if (value && items[index]) {
    const item = items[index];
    if (item) {
      item.name = value;
      router.replace(item.link);
    }
  }
};

watch(router.currentRoute, (value) => {
  items.forEach(item => item.selected = decodeURIComponent(value.path) === item.link);
});

watch(store.getSelectedFile, file => {
  if (file) {
    document.title = `Tabula - ${file.filename}`;
  } else {
    document.title = 'Tabula';
  }
});

</script>

<template>
  <OpenFileButton @open="onOpenFile"/>
  <IconButton icon="file-download"/>
  <Tabs :items="items" fixed
        @select-tab="onSelectFile"
        @remove-tab="onRemoveFile"
        @rename-tab="onRenameFile"/>
</template>
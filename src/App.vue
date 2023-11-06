<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import IconButton from "@/components/IconButton.vue";
import OpenFileButton from "@/components/OpenFileButton.vue";
import {reactive} from "vue";
import {AppFile} from "@/models/AppFile";
import {FileTabItem} from "@/components/FileTabItem";
import {ITabItem} from "@/components/ITabItem";
import router from "@/router";

const items = reactive<FileTabItem[]>([]);

const onOpenFile = async (file: AppFile) => {
  await file.parse();
  const item = new FileTabItem(file);
  items.push(item);
  await router.push(item.link);
};

const onEditFilename = (item: ITabItem, value: string) => {
  const link = item.link;
  item.label = value;
  if (link !== item.link) {
    router.replace(item.link);
  }
};

const onRemoveFile = (index: number) => {
  items.splice(index, 1);
};

</script>

<template>
  <header>
    <OpenFileButton @open="onOpenFile"/>
    <IconButton icon="file-download"/>
    <Tabs :items="items" fixed
          @remove-tab="onRemoveFile"
          @edit-tab="onEditFilename"/>
  </header>
  <main>
    <RouterView/>
  </main>
</template>
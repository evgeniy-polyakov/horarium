<script setup lang="ts">
import {useAppStore} from "@/stores/app";
import Tabs from "@/components/Tabs.vue";
import router from "@/router";
import {TableTabItem} from "@/components/TableTabItem";

const items = useAppStore().tableTabItems;

const onEditTableName = (item: TableTabItem, value: string) => {
  const link = item.link;
  item.label = value;
  if (link !== item.link) {
    item.table.name = value;
    router.replace(item.link);
  }
};

const onRemoveTable = (index: number) => {
  // todo confirmation
  // if (fileTab) {
  //
  // }
  // fileTab?.file.database.deleteTable();
  // items.splice(index, 1);

};

</script>

<template>
  <Tabs :items="items"
        @edit-tab="onEditTableName"
        @remove-tab="onRemoveTable"/>
  <RouterView/>
</template>

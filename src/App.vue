<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import {reactive} from "vue";
import {ITabItem} from "@/components/ITabItem";
import IconButton from "@/components/IconButton.vue";

const items = reactive([
  {label: "AAA", link: "/aaa", editable: true, removable: true},
  {label: "BBB", link: "/bbb", editable: true, removable: true},
] as ITabItem[]);

</script>

<template>
  <header>
    <IconButton icon="folder-open" theme="regular"/>
    <IconButton icon="file-download"/>
    <Tabs :items="items"
          @remove-tab="(index) => items.splice(index,1)"
          @add-tab="() => items.push({label: `Label${items.length}`, link: `/link${items.length}`})"
          @edit-tab="(item, value) => item.label = value"/>
  </header>
  <main>
    <RouterView/>
  </main>
</template>
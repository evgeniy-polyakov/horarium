<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import {reactive} from "vue";
import {ITabItem} from "@/components/ITabItem";

const items = reactive([
  {label: "AAA", link: "/aaa", editable: true, removable: true},
  {label: "BBB", link: "/bbb", editable: true, removable: true},
] as ITabItem[]);

</script>

<template>
  <header>
    <Tabs :items="items"
          @remove-tab="(index) => items.splice(index,1)"
          @add-tab="() => items.push({label: `Label${items.length}`, link: `/link${items.length}`})"
          @edit-tab="(item, value) => item.label = value"/>
  </header>
  <main>
    <RouterView/>
  </main>
</template>
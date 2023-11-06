<script setup lang="ts">
import Tabs from "@/components/Tabs.vue";
import {reactive} from "vue";

const items = reactive([
  {label: "AAA", link: "/aaa"},
  {label: "BBB", link: "/bbb"},
]);

</script>

<template>
  <header>
    <Tabs :items="items"
          @remove-tab="(index) => items.splice(index,1)"
          @add-tab="() => items.push({label: `Label${items.length}`, link: `/link${items.length}`})"/>
  </header>
  <main>
    <RouterView/>
  </main>
</template>
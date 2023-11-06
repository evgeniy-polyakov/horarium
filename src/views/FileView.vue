<script setup lang="ts">
import {useAppStore} from "@/stores/app";
import Tabs from "@/components/Tabs.vue";

const fileTab = useAppStore().selectedFileTab;
const items = useAppStore().tableTabItems;

</script>

<template>
  <Tabs v-if="fileTab" :items="items"/>
  <RouterView/>
</template>

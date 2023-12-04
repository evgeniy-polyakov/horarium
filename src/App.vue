<script setup lang="ts">
import MainMenu from "@/components/MainMenu.vue";
import {useAppStore} from "@/stores/app";

const store = useAppStore();

</script>
<template>
  <header>
    <MainMenu/>
  </header>
  <main>
    <RouterView v-if="store.getSelectedFile()"/>
  </main>
</template>
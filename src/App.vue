<script setup lang="ts">
import MainMenu from "@/components/MainMenu.vue";
</script>
<template>
  <header>
    <MainMenu/>
  </header>
  <main>
    <RouterView/>
  </main>
</template>
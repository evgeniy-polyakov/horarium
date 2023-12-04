<script setup lang="ts">
import TextEditor from "@/components/TextEditor.vue";
import {useAppStore} from "@/stores/app";

const store = useAppStore();

</script>

<template>
  <TextEditor v-if="store.getSelectedFile()"/>
</template>
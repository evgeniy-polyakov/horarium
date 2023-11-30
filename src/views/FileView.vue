<script setup lang="ts">
import {ref, watch} from "vue";
import {useAppStore} from "@/stores/app";

const scrollTopByFile: Record<string, number> = {};
const scrollLeftByFile: Record<string, number> = {};

const store = useAppStore();
const text = ref("");
const filename = ref("");
let textarea = ref<HTMLTextAreaElement>();

watch(text, value => {
  store.getSelectedFile().textContent = value;
});

store.watchSelectedFile(file => {
  text.value = file.textContent;
  filename.value = file.filename;
  const ta = textarea.value;
  if (ta) {
    ta.scrollTop = scrollTopByFile[file.filename] ?? 0;
    ta.scrollLeft = scrollLeftByFile[file.filename] ?? 0;
  }
});

</script>

<template>
  <textarea ref="textarea" v-model="text" @scroll="() => {
    scrollTopByFile[filename] = textarea?.scrollTop ?? 0;
    scrollLeftByFile[filename] = textarea?.scrollLeft ?? 0;
  }"></textarea>
</template>
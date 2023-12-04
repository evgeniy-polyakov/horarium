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
  const file = store.getSelectedFile();
  if (file) {
    file.textContent = value;
  }
});

watch(store.getSelectedFile, file => {
  text.value = file?.textContent ?? "";
  const fn = file?.filename ?? "";
  const ta = textarea.value;
  if (ta) {
    ta.scrollTop = scrollTopByFile[fn] ?? 0;
    ta.scrollLeft = scrollLeftByFile[fn] ?? 0;
  }
}, {immediate: true});

</script>

<template>
  <textarea ref="textarea" v-model="text" v-if="store.getSelectedFile()" @scroll="() => {
    scrollTopByFile[filename] = textarea?.scrollTop ?? 0;
    scrollLeftByFile[filename] = textarea?.scrollLeft ?? 0;
  }"></textarea>
</template>
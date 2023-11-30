<script setup lang="ts">
import IconButton from "@/components/IconButton.vue";
import {FileModel} from "@/models/FileModel";

const emit = defineEmits<{
  (e: 'open', file: FileModel): void,
}>();

const onCLick = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv,text/csv';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) {
      emit('open', new FileModel(file));
    }
  }
  input.click();
};
</script>

<template>
  <IconButton icon="folder-open" theme="regular" @click="onCLick"/>
</template>
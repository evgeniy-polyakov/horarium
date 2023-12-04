<script setup lang="ts">
import TextEditor from "@/components/TextEditor.vue";
import {useAppStore} from "@/stores/app";
import TableEditor from "@/components/TableEditor.vue";
import {EditMode} from "@/models/EditMode";

const store = useAppStore();

</script>

<template>
  <TextEditor v-if="store.getFileState('EditMode', EditMode.Text as EditMode) === EditMode.Text"/>
  <TableEditor v-if="store.getFileState('EditMode', EditMode.Text as EditMode) === EditMode.Table"/>
</template>
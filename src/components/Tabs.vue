<script setup lang="ts">
import {ITabItem} from "@/components/ITabItem";
import Tab from "@/components/Tab.vue";
import IconButton from "@/components/IconButton.vue";

defineProps<{
  items: ITabItem[],
  fixed?: boolean
}>();

defineEmits<{
  (e: 'editTab', item: ITabItem, value: string): void
  (e: 'removeTab', index: number): void
  (e: 'addTab'): void
}>();

</script>

<template>
  <nav>
    <ul>
      <Tab v-for="(item, index) in items" :key="item.link" :item="item"
           @edit="(value) => $emit('editTab', item, value)"
           @remove="() => $emit('removeTab', index)"/>
      <li v-if="!fixed">
        <IconButton icon="plus" @click="$emit('addTab')"/>
      </li>
    </ul>
  </nav>
</template>

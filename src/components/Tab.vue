<script setup lang="ts">
import {ITabItem} from "@/components/ITabItem";
import IconButton from "@/components/IconButton.vue";

defineProps<{
  item: ITabItem,
}>();

defineEmits<{
  (e: 'edit', value: string): void
  (e: 'remove', index: number): void
}>();

</script>

<template>
  <li :class="{selected:item.selected}"
      @dblclick="(event) => {
            const input = (event.currentTarget as HTMLElement)?.querySelector('input');
            if (input) {
              input.style.pointerEvents = '';
              input.focus();
              input.select();
            }
          }">
    <RouterLink :to="item.link">
      <input v-if="item.editable" :value="item.label"
             style="pointer-events: none"
             @change="(event) => $emit('edit', (event.target as HTMLInputElement).value)"
             @blur="(event) => (event.target as HTMLInputElement).style.pointerEvents = 'none'">
      <span>{{ item.label }}</span>
    </RouterLink>
    <IconButton v-if="item.removable" @click="$emit('remove')" icon="xmark"/>
  </li>
</template>

<style scoped lang="scss">
li.selected {
  color: red;
}
</style>
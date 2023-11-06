<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {ITabItem} from "@/components/ITabItem";

defineProps<{
  item: ITabItem,
}>();

defineEmits<{
  (e: 'edit', value: string): void
  (e: 'remove', index: number): void
}>();

</script>

<template>
  <li @dblclick="(event) => {
            const input = event.currentTarget.querySelector('input');
            if (input) {
              input.style.pointerEvents = '';
              input.focus();
              input.select();
            }
          }">
    <RouterLink :to="item.link">
      <input v-if="item.editable" :value="item.label"
             style="pointer-events: none"
             @change="(event) => $emit('edit', event.target.value)"
             @blur="(event) => event.target.style.pointerEvents = 'none'">
      <span>{{ item.label }}</span>
    </RouterLink>
    <button v-if="item.removable" @click="$emit('remove')">
      <FontAwesomeIcon icon="fa-solid fa-xmark"/>
    </button>
  </li>
</template>

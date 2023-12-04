<script setup lang="ts">
import {ITabItem} from "@/components/ITabItem";
import IconButton from "@/components/IconButton.vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

defineProps<{
  item: ITabItem;
}>();

defineEmits<{
  (e: 'edit', value: string): void;
  (e: 'remove'): void;
  (e: 'select'): void;
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
    <button @click="() => {if (!item.selected) $emit('select')}">
      <input v-if="item.editable" :value="item.name"
             style="pointer-events: none"
             @change="(event) => $emit('edit', (event.target as HTMLInputElement).value)"
             @blur="(event) => (event.target as HTMLInputElement).style.pointerEvents = 'none'">
      <span class="name" v-if="item.name">{{ item.name }}</span>
      <span class="icon" v-if="item.icon">
        <FontAwesomeIcon :icon="`fa-solid fa-${item.icon}`"/>
      </span>
    </button>
    <IconButton v-if="item.removable" @click="$emit('remove')" icon="xmark"/>
  </li>
</template>

<style scoped lang="scss">
li.selected {
  color: red;
}
</style>
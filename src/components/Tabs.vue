<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {ITabItem} from "@/components/ITabItem";
import Tab from "@/components/Tab.vue";

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
        <button @click="$emit('addTab')">
          <FontAwesomeIcon icon="fa-solid fa-plus"/>
        </button>
      </li>
    </ul>
  </nav>
</template>

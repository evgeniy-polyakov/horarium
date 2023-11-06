<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

defineProps<{
  items: {
    label: string,
    link: string,
    persistent?: boolean
  }[],
  fixed?: boolean
}>()

defineEmits<{
  (e: 'removeTab', index: number): void
  (e: 'addTab'): void
}>();

</script>

<template>
  <nav>
    <ul>
      <li v-if="!fixed">
        <button @click="$emit('addTab')">
          <FontAwesomeIcon icon="fa-solid fa-plus"/>
        </button>
      </li>
      <li v-for="(item, index) in items" :key="item.link">
        <RouterLink :to="item.link">{{ item.label }}</RouterLink>
        <button v-if="!item.persistent" @click="$emit('removeTab', index)">
          <FontAwesomeIcon icon="fa-solid fa-xmark"/>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

defineProps<{
  icon: string,
  theme?: 'solid' | 'regular'
}>();

</script>

<template>
  <button>
    <FontAwesomeIcon :icon="`fa-${theme ?? 'solid'} fa-${icon}`"/>
  </button>
</template>

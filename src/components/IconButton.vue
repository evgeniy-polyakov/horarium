<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

defineProps<{
  icon: string,
}>();

</script>

<template>
  <button>
    <FontAwesomeIcon :icon="`fa-solid fa-${icon}`"/>
  </button>
</template>

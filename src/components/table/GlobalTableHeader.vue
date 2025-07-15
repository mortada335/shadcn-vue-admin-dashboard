<script setup lang="ts">
const props = defineProps<{
  sortable?: boolean
  label: string
  class?: string
}>()
</script>
<template>
  <p :class="`text-start ${props.class}`">{{ $t(label) }}</p>
</template>

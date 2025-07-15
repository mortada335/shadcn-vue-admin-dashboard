<script setup lang="ts">
import { Badge } from '@/components/ui/badge';

defineProps<{
  value: any
}>()
</script>
<template>
  <template v-if="Array.isArray(value)">
    <Badge v-for="v in value">{{ $t(v) }}</Badge>
  </template>
  <template v-else>
    <Badge>{{ $t(value) }}</Badge>
  </template>
</template>

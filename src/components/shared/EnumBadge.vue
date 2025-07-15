<script setup lang="ts">
import { Badge } from '@/components/ui/badge';
import { AppEnumGroup, AppEnumValue, getEnumByValue } from '@/utils/enums';

defineProps<{
  value: AppEnumValue | AppEnumValue[]
  enums: AppEnumGroup
}>()
</script>
<template>
  <template v-if="Array.isArray(value)">
    <div class="flex flex-wrap">
      <Badge v-for="appEnum in value">{{ $t(getEnumByValue(enums, appEnum).name) }}</Badge>
    </div>
  </template>
  <template v-else>
    <Badge>{{ $t(getEnumByValue(enums, value).name) }}</Badge>
  </template>
</template>

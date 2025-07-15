<script setup lang="ts">
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { breakpointsTailwind } from '@vueuse/core';

defineProps<{
  title: string,
  size: 'md' | 'lg' | 'xl' | 'sm' | '2xl',
  isLoading: boolean
}>()
const model = defineModel<boolean>();

</script>
<template>
  <Dialog v-model:open="model">
    <DialogContent class="p-5" :style="`width: ${breakpointsTailwind[size]}px`">
      <DialogHeader>
        <DialogTitle>{{ $t(title) }}</DialogTitle>
      </DialogHeader>
      <div class="overflow-y-auto max-h-[70vh] px-2 form-scrollbar">
        <Skeleton v-if="isLoading" class="w-full h-[400px]" />
        <slot v-else />
      </div>
    </DialogContent>
  </Dialog>
</template>

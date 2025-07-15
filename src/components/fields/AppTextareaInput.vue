<script setup lang="ts">
import { TextareaInputProps } from './types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

defineProps<TextareaInputProps>()

const model = defineModel<string>();

defineSlots<{
  'label': (props: { value: string }) => void
  'default': () => void
}>()

</script>
<template>
  <div class="grid w-full items-center gap-3">
    <slot name="label" :value="model ?? ''">
      <Label v-if="label" :for="id">{{ $t(label) }}</Label>
    </slot>
    <Textarea :disabled :id :placeholder="$t(placeholder ?? '')" v-model="model" />
    <slot />
  </div>
</template>

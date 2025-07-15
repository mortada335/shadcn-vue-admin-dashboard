<script setup lang="ts">
import { SliderInputProps } from './types';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils'
const props = defineProps<SliderInputProps>()

const values = ref<number[]>([0]);
const model = defineModel<number>();

defineSlots<{
  'label': (props: { value: string | number }) => void
  'default': () => void
}>()

watch(values, (v) => model.value = v[0])

</script>
<template>
  <div :class="cn('grid w-full max-w-sm items-center gap-3', props.class)">
    <slot name="label" :value="model ?? ''">
      <Label v-if="label" :for="id">{{ $t(label) }}</Label>
    </slot>
    <div class="relative w-full items-center flex flex-col gap-2">
      <Slider :disabled :id v-model="values" :max :min :step :default-value="[50]" />
      <div class="flex justify-center text-muted-foreground">
        <span>{{ model ?? $t(placeholder ?? '') }}</span>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { BaseInputProps } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils'
const props = defineProps<BaseInputProps>()

const model = defineModel<string | number>();

defineEmits<{
  update: [id: string]
}>()

defineSlots<{
  'label': (props: { value: string | number }) => void
  'default': () => void
}>()

const viewPassword = ref(false);
const computedType = computed(() => {
  if (props.type != 'password') return props.type;
  return viewPassword.value ? 'text' : 'password';
})

</script>
<template>
  <div :class="cn('grid w-full max-w-sm items-center gap-3', props.class)">
    <slot name="label" :value="model ?? ''">
      <Label v-if="label" :for="id">{{ $t(label) }}</Label>
    </slot>
    <div class="relative w-full items-center">
      <Input @update="(v: string) => $emit('update', v)" :disabled :id :placeholder="$t(placeholder ?? '')"
        :type="computedType" v-model="model" />
      <span @click="viewPassword = !viewPassword" v-if="type == 'password'"
        class="absolute end-0 inset-y-0 flex items-center justify-center px-2">
        <icon :icon="viewPassword ? 'tabler-eye-closed' : 'tabler-eye'" class="size-5 text-muted-foreground" />
      </span>
    </div>
    <slot />
  </div>
</template>

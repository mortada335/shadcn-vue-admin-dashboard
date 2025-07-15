<script setup lang="ts">
import { CurrencyInputProps } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils'
import CurrencyListSelect from './CurrencyListSelect.vue';
import { useAuthStore } from '@/stores/auth';
const props = defineProps<CurrencyInputProps>()

const model = defineModel<number | string>();

const value = ref<number>();

const { activeCurrency } = useAuthStore();

const lastActiveRate = ref(activeCurrency.exchangeRate)

defineEmits<{
  update: [id: string]
}>()

defineSlots<{
  'label': (props: { value: string | number }) => void
  'default': () => void
}>()


const updateValue = (rate: number) => {
  lastActiveRate.value = rate;
}

watch([value, lastActiveRate], ([v, r]) => {
  if (!v) {
    model.value = '';
    return;
  }
  model.value = (typeof (v) == 'string' ? parseFloat(v) : v) * r;
})

</script>
<template>
  <div :class="cn('grid w-full max-w-sm items-center gap-3', props.class)">
    <slot name="label" :value="model ?? ''">
      <Label v-if="label" :for="id">{{ $t(label) }}</Label>
    </slot>
    <div class="w-full flex gap-1 items-center">
      <Input @update="(v: string) => $emit('update', v)" :disabled :id :placeholder="$t(placeholder ?? '')"
        type="number" v-model="value" class="grow" />
      <CurrencyListSelect @update:currency="({ exchangeRate }) => updateValue(exchangeRate)" class="w-20" />
    </div>
    <slot />
  </div>
</template>

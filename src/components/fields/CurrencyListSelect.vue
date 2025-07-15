<script setup lang="ts">
import { Client } from '@/api/client';
import { Select, SelectContent, SelectLabel, SelectItem, SelectGroup, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore, iraqiDinar } from '@/stores/auth';
import { Currency, QueryKeys } from '@/views/currencies/types';
import { useQuery } from '@tanstack/vue-query';
import { HTMLAttributes } from 'vue';

defineProps<{
  class: HTMLAttributes['class']
}>()

const authStore = useAuthStore();

const activeCurrency = ref(authStore.activeCurrency)

const { data: currencies } = useQuery({
  queryKey: [QueryKeys.getAll, 'select'],
  queryFn: async () => {
    return [iraqiDinar, ...(await Client.get<Currency>('currencies', { pageSize: 20, pageNumber: 1 })).items];
  }
})

const emit = defineEmits<{
  'update:currency': [currency: Currency]
}>()

</script>

<template>
  <Select @update:model-value="(value) => { emit('update:currency', value as any as Currency) }">
    <SelectTrigger :class>
      <SelectValue :placeholder="activeCurrency.code ?? 'IQD'" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{{ $t('Currencies') }}</SelectLabel>
        <SelectItem v-for="currency in currencies" :value="currency as any as string">
          {{ currency.code }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>

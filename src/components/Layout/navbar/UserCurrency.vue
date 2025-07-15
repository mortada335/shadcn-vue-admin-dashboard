<script lang="ts" setup>
import { Client } from '@/api/client';
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore, iraqiDinar } from '@/stores/auth';
import { Currency, QueryKeys } from '@/views/currencies/types';
import { useQuery } from '@tanstack/vue-query';

const updateCurrency = (currency: Currency) => {
  localStorage.setItem('currency', JSON.stringify(currency));
  useAuthStore().activeCurrency = currency;
}
const { data: currencies } = useQuery({
  queryKey: [QueryKeys.getAll, 'navbar'],
  queryFn: async () => {
    return [iraqiDinar, ...(await Client.get<Currency>('currencies', { pageSize: 20, pageNumber: 1 })).items];
  }
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <icon icon="tabler-coins" width="24" height="24" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-40">
      <DropdownMenuLabel class="text-center text-sm">
        {{ $t("change the currency") }}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup>
        <DropdownMenuRadioItem class="flex justify-center" @click="updateCurrency(currency as Currency)"
          v-for="currency in currencies" :value="currency.code">
          <span class="font-bold">
            {{ currency.symbol }}
          </span>
          <span>-</span>
          <span class="font-bold">
            {{ currency.code }}
          </span>
          <span>-</span>
          <span>
            {{ currency.name }}
          </span>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

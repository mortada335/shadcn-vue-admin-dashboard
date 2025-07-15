<script setup lang="ts" generic="TData">
import { type Table } from '@tanstack/vue-table'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIsRtl } from '@/composable/useRtl';
import { useTableStore } from '@/stores/table';

interface DataTablePaginationProps {
  table: Table<TData>
  totalPages: number,
  currentPage: number,
}
const tableStore = useTableStore();

const props = defineProps<DataTablePaginationProps>()
const nextPage = () => {
  tableStore.pageNumber++;
}
const previousPage = () => {
  tableStore.pageNumber--;
}
const gotoZero = () => {
  tableStore.pageNumber = 1;
}
const gotoLast = () => {
  tableStore.pageNumber = props.totalPages;
}
</script>

<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex items-center gap-6">
      <div class="flex items-center space-x-2">
        <p class="text-sm font-medium mx-2">
          {{ $t("Rows per page") }}
        </p>
        <Select :model-value="`${tableStore.pageSize}`" @update:model-value="(v) => {
          tableStore.pageSize = parseInt(v)
          tableStore.resetNumber();
        }">
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem v-for="pageSize in [5, 10, 15, 20, 25, 30]" :key="pageSize" :value="`${pageSize}`">
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="flex w-[100px] items-center justify-center text-sm font-medium">
        {{ $t('Page') }} {{ currentPage }} {{ $t('of') }}
        {{ totalPages }}
      </div>
      <div class="flex items-center space-x-2">
        <Button variant="outline" class="hidden w-8 h-8 p-0 lg:flex" :disabled="currentPage == 1" @click="gotoZero">
          <span class="sr-only">Go to first page</span>
          <icon icon="tabler-chevron-left-pipe" class="w-4 h-4" :class="useIsRtl() ? 'rotate-180' : ''" />
        </Button>
        <Button variant="outline" class="w-8 h-8 p-0" :disabled="currentPage == 1" @click="previousPage()">
          <span class="sr-only">Go to previous page</span>
          <icon icon="tabler-chevron-left" class="w-4 h-4" :class="useIsRtl() ? 'rotate-180' : ''" />
        </Button>
        <Button variant="outline" class="w-8 h-8 p-0" :disabled="currentPage >= totalPages" @click="nextPage()">
          <span class="sr-only">Go to next page</span>
          <icon icon="tabler-chevron-right" class="w-4 h-4" :class="useIsRtl() ? 'rotate-180' : ''" />
        </Button>
        <Button variant="outline" class="hidden w-8 h-8 p-0 lg:flex" :disabled="currentPage >= totalPages"
          @click="gotoLast">
          <span class="sr-only">Go to last page</span>
          <icon icon="tabler-chevron-right-pipe" class="w-4 h-4" :class="useIsRtl() ? 'rotate-180' : ''" />
        </Button>
      </div>
    </div>
  </div>
</template>

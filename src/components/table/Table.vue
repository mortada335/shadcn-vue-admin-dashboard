<script setup lang="ts" generic="TData, TValue">
import { camelCaseToRegular } from '@/utils/strings'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { valueUpdater } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { ref } from 'vue'

import {
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TablePagination from './TablePagination.vue'
import { Skeleton } from '@/components/ui/skeleton'
import { useTableStore } from '@/stores/table'
import { useRouter } from 'vue-router'

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[]
  data?: TData[]
  isLoading?: boolean
  totalCount: number
  totalPages: number
  currentPage: number
}>()

const sorting = ref<SortingState>([])
const tableStore = useTableStore();
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const router = useRouter();
const emit = defineEmits<{
  (e: 'options', options: { pageSize: number, pageNumber: number }): void

}>()

const table = useVueTable({
  get data() { return props.data ?? [] },
  get columns() { return props.columns },
  rowCount: props.totalCount,
  pageCount: Math.floor(props.totalCount / tableStore.pageSize),
  manualPagination: false,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get pagination() { return { pageSize: 40, pageIndex: 0 } }
  },
})

watch(() => tableStore.options, (v) => {
  table.setPageSize(v.pageSize)
  router.replace({
    query: {
      ...router.currentRoute.value.query,
      ...v
    }
  })
  emit('options', v)
})

onBeforeUnmount(() => {
  tableStore.reset();
})
</script>
<template>
  <div class="border rounded-md text-start">
    <div class="grid items-center justify-start p-3">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            {{ $t("Columns") }}
            <icon icon="tabler-chevron-down" class="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id" class="capitalize" :checked="column.getIsVisible()" @update:checked="(value) => {
              column.toggleVisibility(!!value)
            }">
            {{ $t(camelCaseToRegular(column.id)) }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead class="min-w-40" v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
              :props="header.getContext()" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody v-if="props.isLoading">
        <TableRow v-for="row in 10" :key="row">
          <TableCell v-for="c in columns.length" :key="c">
            <Skeleton class="w-full h-[20px]" />
          </TableCell>
        </TableRow>
      </TableBody>
      <TableBody v-else>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow v-for="row in table.getRowModel().rows" :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined">
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              {{ $t("No results") }}
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
  <div class="my-3">
    <TablePagination :table :totalPages :currentPage />
  </div>
</template>

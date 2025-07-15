import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import type { Material } from './types'
import GlobalTableHeader from '@/components/table/GlobalTableHeader.vue'
import type { FilterField } from '@/utils/filters/types/filters'
import TableActions from './components/TableActions.vue'
import { getEnumByValue, MaterialBreakage } from '@/utils/enums'
import { formatDateAsString } from '@/utils/date'
import Badge from '@/components/shared/Badge.vue'
import EnumBadge from '@/components/shared/EnumBadge.vue'

export const URL = '/materials';
export const columns: ColumnDef<Material>[] = [
  {
    accessorKey: 'name',
    header: () => h(GlobalTableHeader, { label: 'Name' }),
    cell: ({ row }) => h('p', { class: 'text-start' }, row.getValue('name'))
  },
  {
    accessorKey: 'isBreakable',
    header: () => h(GlobalTableHeader, { label: 'Is Breakable' }),
    cell: ({ row }) => h(EnumBadge, { value: row.original.isBreakable, enums: MaterialBreakage })
  },
  {
    accessorKey: 'createdAt',
    minSize: 20,
    header: () => h(GlobalTableHeader, { label: 'Created At', class: 'text-center' }),
    cell: ({ row }) => h('p', { class: 'text-start' }, formatDateAsString(row.getValue('createdAt') as string))
  },

  {
    accessorKey: 'actions',
    minSize: 20,
    header: () => h(GlobalTableHeader, { label: 'Actions', class: 'text-center' }),
    cell: ({ row }) => h(TableActions, { ...row.original })
  },
]

export const filters: FilterField[] = [
  {
    key: 'name',
    label: 'Name',
    type: 'text'
  },
  {
    key: 'isBreakable',
    label: 'is Breakable',
    type: 'select',
    options: {
      itemLabel: 'name',
      itemValue: 'value',
      items: MaterialBreakage
    }
  },
  {
    key: 'createdBy',
    label: 'Created By',
    type: 'select',
    options: {
      itemLabel: 'name',
      itemValue: 'id',
      getUrl: '/users',
      searchKey: 'name',
    }
  },
  {
    key: 'createdAt',
    label: 'Creation Date',
    type: 'date'
  }
]

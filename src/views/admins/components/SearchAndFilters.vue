<template>
  <Card>
    <CardContent class="p-6">
      <div class="flex flex-col w-full space-y-4 md:flex-row md:space-y-0 md:space-x-4 gap-2">
        <!-- Search Input -->
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              :model-value="searchQuery"
              @update:model-value="$emit('search', String($event))"
              :placeholder="t('Search admins...')"
              class="pl-8"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <Select
          :model-value="statusFilter"
          @update:model-value="updateStatusFilter"
        >
          <SelectTrigger class="w-[180px]">
            <SelectValue :placeholder="t('Filter by status')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{{t("all_status")}}</SelectItem>
            <SelectItem value="active">{{t("active_only")}}</SelectItem>
            <SelectItem value="inactive">{{t("inactive_only")}}</SelectItem>
          </SelectContent>
        </Select>

        <!-- Role Filter -->
        <Select
          :model-value="roleFilter"
          @update:model-value="updateRoleFilter"
        >
          <SelectTrigger class="w-[180px]">
            <SelectValue :placeholder="t('Filter by role')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{{ t("all_admins") }}</SelectItem>
            <SelectItem value="admin">{{t("admin")}}</SelectItem>
            <SelectItem value="super_admin">{{t("super_admin")}}</SelectItem>
            <SelectItem value="moderator">{{t("moderator")}}</SelectItem>
          </SelectContent>
        </Select>

        <!-- Export Button -->
        <Button variant="outline"  @click="$emit('export')">
          <Download class="w-8 h-8 mr-2" />
          {{t("export")}}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Download } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FilterOption } from '@/types/admins'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  searchQuery: string
  filters: FilterOption[]
}>()

const emit = defineEmits<{
  search: [query: string]
  filter: [filters: FilterOption[]]
  export: []
}>()

const { t } = useI18n()

const statusFilter = computed(() => {
  const filter = props.filters.find(f => f.key === 'status')
  return filter?.value || 'all'
})

const roleFilter = computed(() => {
  const filter = props.filters.find(f => f.key === 'role')
  return filter?.value || 'all'
})

const updateStatusFilter = (value: string) => {
  const newFilters = props.filters.filter(f => f.key !== 'status')
  if (value !== 'all') {
    newFilters.push({ key: 'status', label: 'Status', value })
  }
  emit('filter', newFilters)
}

const updateRoleFilter = (value: string) => {
  const newFilters = props.filters.filter(f => f.key !== 'role')
  if (value !== 'all') {
    newFilters.push({ key: 'role', label: 'Role', value })
  }
  emit('filter', newFilters)
}
</script>
<template>
  <Card>
    <CardContent class="p-6">
      <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <!-- Search Input -->
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              :model-value="searchQuery"
              @update:model-value="$emit('search', String($event))"
              placeholder="Search admins..."
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
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>

        <!-- Role Filter -->
        <Select
          :model-value="roleFilter"
          @update:model-value="updateRoleFilter"
        >
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="moderator">Moderator</SelectItem>
          </SelectContent>
        </Select>

        <!-- Export Button -->
        <Button variant="outline" @click="$emit('export')">
          <Download class="w-4 h-4 mr-2" />
          Export
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

const props = defineProps<{
  searchQuery: string
  filters: FilterOption[]
}>()

const emit = defineEmits<{
  search: [query: string]
  filter: [filters: FilterOption[]]
  export: []
}>()

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
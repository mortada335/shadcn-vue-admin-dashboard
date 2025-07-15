<template>
  <Card>
    <CardContent class="flex items-center justify-between p-4">
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {{ startItem }} to {{ endItem }} of {{ pagination.total }} results
        </span>
        <Select :model-value="pagination.limit.toString()" @update:model-value="updateLimit">
          <SelectTrigger class="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>per page</span>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page <= 1"
          @click="$emit('page-change', pagination.page - 1)"
        >
          <ChevronLeft class="w-4 h-4" />
          Previous
        </Button>

        <div class="flex items-center gap-1">
          <Button
            v-for="page in visiblePages"
            :key="page"
            :variant="page === pagination.page ? 'default' : 'outline'"
            size="sm"
            class="w-8 h-8 p-0"
            @click="$emit('page-change', page)"
          >
            {{ page }}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page >= pagination.totalPages"
          @click="$emit('page-change', pagination.page + 1)"
        >
          Next
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PaginationData } from '@/types/admins'

const props = defineProps<{
  pagination: PaginationData
}>()

const emit = defineEmits<{
  'page-change': [page: number]
  'limit-change': [limit: number]
}>()

const startItem = computed(() => 
  (props.pagination.page - 1) * props.pagination.limit + 1
)

const endItem = computed(() => 
  Math.min(props.pagination.page * props.pagination.limit, props.pagination.total)
)

const visiblePages = computed(() => {
  const current = props.pagination.page
  const total = props.pagination.totalPages
  const delta = 2

  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else if (total > 1) {
    rangeWithDots.push(total)
  }

  return rangeWithDots.filter(page => typeof page === 'number') as number[]
})

const updateLimit = (value: string) => {
  emit('limit-change', parseInt(value))
}
</script>
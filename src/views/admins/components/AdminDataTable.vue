<template>
  <Card>
    <CardHeader v-if="selectedItems.length > 0">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Checkbox
            :checked="isAllSelected"
            @update:checked="toggleSelectAll"
          />
          <span class="text-sm font-medium">
            {{ selectedItems.length }} of {{ admins.length }} selected
          </span>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            @click="$emit('bulk-delete', selectedItems)"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent class="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead class="w-12">
              <Checkbox
                :checked="isAllSelected"
                @update:checked="toggleSelectAll"
              />
            </TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead 
              class="cursor-pointer hover:bg-muted/50"
              @click="$emit('sort', 'name')"
            >
              <div class="flex items-center gap-1">
                Name
                <ArrowUpDown class="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead 
              class="cursor-pointer hover:bg-muted/50"
              @click="$emit('sort', 'email')"
            >
              <div class="flex items-center gap-1">
                Email
                <ArrowUpDown class="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead 
              class="cursor-pointer hover:bg-muted/50"
              @click="$emit('sort', 'age')"
            >
              <div class="flex items-center gap-1">
                Age
                <ArrowUpDown class="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead 
              class="cursor-pointer hover:bg-muted/50"
              @click="$emit('sort', 'createdAt')"
            >
              <div class="flex items-center gap-1">
                Created
                <ArrowUpDown class="w-4 h-4" />
              </div>
            </TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow 
            v-for="admin in admins" 
            :key="admin.id"
            :class="{ 'bg-muted/50': selectedItems.some(item => item.id === admin.id) }"
          >
            <TableCell>
              <Checkbox
                :checked="selectedItems.some(item => item.id === admin.id)"
                @update:checked="toggleSelectItem(admin)"
              />
            </TableCell>
            <TableCell>
              <Avatar class="h-10 w-10">
                <AvatarImage v-if="admin.avatar" :src="admin.avatar" :alt="admin.name" />
                <AvatarFallback>{{ getInitials(admin.name) }}</AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell class="font-medium">{{ admin.name }}</TableCell>
            <TableCell>{{ admin.email }}</TableCell>
            <TableCell>{{ admin.age }}</TableCell>
            <TableCell>
              <Badge :variant="getRoleVariant(admin.role)">
                {{ formatRole(admin.role) }}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge :variant="admin.isActive ? 'default' : 'secondary'">
                {{ admin.isActive ? 'Active' : 'Inactive' }}
              </Badge>
            </TableCell>
            <TableCell class="text-muted-foreground">
              {{ formatDate(admin.createdAt) }}
            </TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button variant="ghost" size="sm" @click="$emit('edit', admin)">
                  <Edit class="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" @click="$emit('delete', admin)">
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="admins.length === 0">
            <TableCell colspan="9" class="text-center py-8 text-muted-foreground">
              <div class="flex flex-col items-center gap-2">
                <Users class="w-8 h-8 text-muted-foreground/50" />
                <span>No admins found</span>
                <span class="text-sm">Add your first admin to get started</span>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Edit, Trash2, ArrowUpDown, Users } from 'lucide-vue-next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Admin } from '@/types/admins'

const props = defineProps<{
  admins: Admin[]
}>()

const emit = defineEmits<{
  'edit': [admin: Admin]
  'delete': [admin: Admin]
  'bulk-delete': [admins: Admin[]]
  'sort': [column: string]
}>()

const selectedItems = ref<Admin[]>([])

const isAllSelected = computed(() => 
  props.admins.length > 0 && selectedItems.value.length === props.admins.length
)

const toggleSelectAll = (checked: boolean) => {
  selectedItems.value = checked ? [...props.admins] : []
}

const toggleSelectItem = (admin: Admin) => {
  const index = selectedItems.value.findIndex(item => item.id === admin.id)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(admin)
  }
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleVariant = (role: string) => {
  switch (role) {
    case 'super_admin': return 'destructive'
    case 'admin': return 'default'
    case 'moderator': return 'secondary'
    default: return 'outline'
  }
}

const formatRole = (role: string): string => {
  return role.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}
</script>
<template>
  <div class="container mx-auto py-10 px-4">
    <h1 class="text-3xl font-bold mb-6">User Management</h1>
    
    <!-- Search and Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <Input 
          v-model="searchQuery" 
          placeholder="Search users..." 
          class="w-full"
          @input="handleSearch" 
        />
      </div>
      <div class="flex gap-2">
        <Select v-model="roleFilter" @update:modelValue="handleSearch">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
          </SelectContent>
        </Select>
        
        <Select v-model="statusFilter" @update:modelValue="handleSearch">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button @click="openCreateDialog" class="shrink-0">
        <PlusIcon class="h-4 w-4 mr-2" />
        Add User
      </Button>
    </div>
    
    <!-- Data Table -->
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="user in paginatedUsers" :key="user.id">
            <TableCell class="font-medium">{{ user.name }}</TableCell>
            <TableCell>{{ user.email }}</TableCell>
            <TableCell>
              <Badge :variant="getRoleBadgeVariant(user.role)">
                {{ user.role }}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge :variant="user.status === 'active' ? 'success' : 'destructive'">
                {{ user.status }}
              </Badge>
            </TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button variant="ghost" size="icon" @click="openEditDialog(user)">
                  <PencilIcon class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" @click="openDeleteDialog(user)">
                  <TrashIcon class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="paginatedUsers.length === 0">
            <TableCell colspan="5" class="text-center py-8">
              No users found. Try adjusting your filters.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    
    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-muted-foreground">
        Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredUsers.length) }} of {{ filteredUsers.length }} users
      </div>
      <div class="flex items-center space-x-6 lg:space-x-8">
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium">Rows per page</p>
          <Select v-model="pageSize" @update:modelValue="handlePageSizeChange">
            <SelectTrigger class="h-8 w-[70px]">
              <SelectValue :placeholder="pageSize" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="5">5</SelectItem>
              <SelectItem :value="10">10</SelectItem>
              <SelectItem :value="20">20</SelectItem>
              <SelectItem :value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {{ currentPage + 1 }} of {{ totalPages }}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            :disabled="currentPage === 0"
            @click="prevPage"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            :disabled="currentPage >= totalPages - 1"
            @click="nextPage"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Create/Edit Dialog -->
    <Dialog :open="showDialog" @update:open="showDialog = $event">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit User' : 'Create User' }}</DialogTitle>
          <DialogDescription>
            {{ isEditing ? 'Update user details below.' : 'Add a new user to your organization.' }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">Name</Label>
            <Input id="name" v-model="formData.name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="email" class="text-right">Email</Label>
            <Input id="email" v-model="formData.email" type="email" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="role" class="text-right">Role</Label>
            <Select v-model="formData.role" class="col-span-3">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="status" class="text-right">Status</Label>
            <div class="flex items-center space-x-2 col-span-3">
              <Switch id="status" v-model="formData.status" />
              <Label for="status">{{ formData.status === 'active' ? 'Active' : 'Inactive' }}</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showDialog = false">Cancel</Button>
          <Button @click="saveUser">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    
    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            {{ selectedUser?.name }} and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="showDeleteDialog = false">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="deleteUser">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
    <!-- Toast for notifications -->
    <Toaster />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useToast } from '@/components/ui/toast'

// Import shadcn-vue components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import  Toaster  from '@/components/ui/toast/Toaster.vue'

// Import icons from lucide-vue-next
import { PlusIcon, PencilIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next'

// Toast notification
const { toast } = useToast()

// Sample data
const users = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'editor', status: 'inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'admin', status: 'inactive' },
  { id: 6, name: 'Diana Miller', email: 'diana@example.com', role: 'editor', status: 'active' },
  { id: 7, name: 'Edward Davis', email: 'edward@example.com', role: 'user', status: 'active' },
  { id: 8, name: 'Fiona Clark', email: 'fiona@example.com', role: 'user', status: 'inactive' },
  { id: 9, name: 'George White', email: 'george@example.com', role: 'editor', status: 'active' },
  { id: 10, name: 'Hannah Green', email: 'hannah@example.com', role: 'admin', status: 'active' },
  { id: 11, name: 'Ian Black', email: 'ian@example.com', role: 'user', status: 'inactive' },
  { id: 12, name: 'Julia Reed', email: 'julia@example.com', role: 'editor', status: 'active' },
])

// Search and filter state
const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')

// Pagination state
const currentPage = ref(0)
const pageSize = ref(5)

// Dialog state
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const selectedUser = ref(null)
const formData = ref({
  name: '',
  email: '',
  role: 'user',
  status: 'active'
})

// Computed properties for filtering and pagination
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
    const matchesStatus = statusFilter.value === 'all' || user.status === statusFilter.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value))
const startIndex = computed(() => currentPage.value * pageSize.value)
const endIndex = computed(() => startIndex.value + pageSize.value)
const paginatedUsers = computed(() => filteredUsers.value.slice(startIndex.value, endIndex.value))

// Reset to first page when filters change
watch([searchQuery, roleFilter, statusFilter], () => {
  currentPage.value = 0
})

// Methods for pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const handlePageSizeChange = () => {
  // Reset to first page when changing page size
  currentPage.value = 0
}

// Methods for search and filtering
const handleSearch = () => {
  // Reset to first page when search/filter changes
  currentPage.value = 0
}

// Methods for CRUD operations
const openCreateDialog = () => {
  isEditing.value = false
  formData.value = {
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  }
  showDialog.value = true
}

const openEditDialog = (user) => {
  isEditing.value = true
  selectedUser.value = user
  formData.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  }
  showDialog.value = true
}

const openDeleteDialog = (user) => {
  selectedUser.value = user
  showDeleteDialog.value = true
}

const saveUser = () => {
  // Validate form
  if (!formData.value.name || !formData.value.email) {
    toast({
      title: "Validation Error",
      description: "Name and email are required fields.",
      variant: "destructive"
    })
    return
  }
  
  if (isEditing.value && selectedUser.value) {
    // Update existing user
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        name: formData.value.name,
        email: formData.value.email,
        role: formData.value.role,
        status: formData.value.status
      }
      toast({
        title: "User Updated",
        description: `${formData.value.name} has been updated successfully.`
      })
    }
  } else {
    // Create new user
    const newId = Math.max(...users.value.map(u => u.id)) + 1
    users.value.push({
      id: newId,
      name: formData.value.name,
      email: formData.value.email,
      role: formData.value.role,
      status: formData.value.status
    })
    toast({
      title: "User Created",
      description: `${formData.value.name} has been added successfully.`
    })
  }
  
  showDialog.value = false
}

const deleteUser = () => {
  if (selectedUser.value) {
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      const userName = users.value[index].name
      users.value.splice(index, 1)
      toast({
        title: "User Deleted",
        description: `${userName} has been removed successfully.`
      })
    }
  }
  showDeleteDialog.value = false
}

// Helper function for badge styling
const getRoleBadgeVariant = (role) => {
  switch (role) {
    case 'admin': return 'default'
    case 'editor': return 'secondary'
    case 'user': return 'outline'
    default: return 'outline'
  }
}
</script>

<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Admin Management</h1>
      <Button @click="openAddDialog">
        <Plus class="w-4 h-4 mr-2" />
        Add Admin
      </Button>
    </div>

    <Card>
      <CardContent class="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="admin in admins" :key="admin.id">
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
                <Badge :variant="admin.isActive ? 'default' : 'secondary'">
                  {{ admin.isActive ? 'Active' : 'Inactive' }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" @click="openEditDialog(admin)">
                    <Edit class="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" @click="openDeleteDialog(admin)">
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-if="admins.length === 0">
              <TableCell colspan="6" class="text-center py-8 text-muted-foreground">
                No admins found. Add your first admin to get started.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Add/Edit Dialog -->
    <Dialog v-model:open="dialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ editingAdmin ? 'Edit Admin' : 'Add New Admin' }}</DialogTitle>
          <DialogDescription>
            {{ editingAdmin ? 'Update admin information below.' : 'Fill in the details to create a new admin.' }}
          </DialogDescription>
        </DialogHeader>
        
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label for="name">Name</Label>
              <Input
                id="name"
                v-model="form.name"
                placeholder="Enter admin name"
                required
              />
            </div>
            
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div class="grid gap-2">
              <Label for="age">Age</Label>
              <Input
                id="age"
                v-model.number="form.age"
                type="number"
                min="18"
                max="100"
                placeholder="Enter age"
                required
              />
            </div>
            
            <div class="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                v-model:checked="form.isActive"
              />
              <Label for="isActive">Active Status</Label>
            </div>
            
            <div class="grid gap-2">
              <Label for="avatar">Avatar</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                @change="onFileChange"
                class="cursor-pointer"
              />
              <div v-if="form.avatar" class="mt-2">
                <Avatar class="h-16 w-16">
                  <AvatarImage :src="form.avatar" alt="Preview" />
                  <AvatarFallback>Preview</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" @click="closeDialog">
              Cancel
            </Button>
            <Button type="submit">
              {{ editingAdmin ? 'Update Admin' : 'Create Admin' }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Admin</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{{ deletingAdmin?.name }}</strong>? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">
            Cancel
          </Button>
          <Button variant="destructive" @click="confirmDelete">
            Delete Admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Toast notifications -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast'
import { useAdminStore, type Admin } from '@/views/admins/store/store'
const {toast} = useToast()
// Types

const store= useAdminStore()
// Store implementation
class AdminStore {
  private admins = ref<Admin[]>(store.admins || []
//     {
//       id: '1',
//       name: 'John Doe',
//       email: 'john@example.com',
//       age: 30,
//       isActive: true,
//       avatar: '/placeholder.svg?height=40&width=40',
//       createdAt: new Date('2024-01-15'),
//       updatedAt: new Date('2024-01-15')
//     },
//     {
//       id: '2',
//       name: 'Jane Smith',
//       email: 'jane@example.com',
//       age: 28,
//       isActive: false,
//       avatar: '',
//       createdAt: new Date('2024-01-20'),
//       updatedAt: new Date('2024-01-20')
//     }
  )

  getAdmins() {
    return computed(() => this.admins.value)
  }

  addAdmin(adminData: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>) {
    const newAdmin: Admin = {
      ...adminData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.admins.value.push(newAdmin)
    toast({ title: 'Admin created successfully!'})
  }

  updateAdmin(id: string, adminData: Partial<Omit<Admin, 'id' | 'createdAt'>>) {
    const index = this.admins.value.findIndex(admin => admin.id === id)
    if (index !== -1) {
      this.admins.value[index] = {
        ...this.admins.value[index],
        ...adminData,
        updatedAt: new Date()
      }
      toast({title: 'Admin updated successfully!'})
    }
  }

  deleteAdmin(id: string) {
    const index = this.admins.value.findIndex(admin => admin.id === id)
    if (index !== -1) {
      this.admins.value.splice(index, 1)
      toast({title: 'Admin deleted successfully!'})
    }
  }

  getAdminById(id: string) {
    return this.admins.value.find(admin => admin.id === id)
  }

  searchAdmins(query: string) {
    return computed(() => 
      this.admins.value.filter(admin => 
        admin.name.toLowerCase().includes(query.toLowerCase()) ||
        admin.email.toLowerCase().includes(query.toLowerCase())
      )
    )
  }
}

// Store instance
const adminStore = new AdminStore()
const admins = adminStore.getAdmins()

// Dialog states
const dialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingAdmin = ref<Admin | null>(null)
const deletingAdmin = ref<Admin | null>(null)

// Form state
const form = reactive<Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>>({
  name: '',
  email: '',
  age: 18,
  isActive: true,
  avatar: ''
})

// Helper functions
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.age = 18
  form.isActive = true
  form.avatar = ''
}

function openAddDialog() {
  resetForm()
  editingAdmin.value = null
  dialogOpen.value = true
}

function openEditDialog(admin: Admin) {
  editingAdmin.value = admin
  form.name = admin.name
  form.email = admin.email
  form.age = admin.age
  form.isActive = admin.isActive
  form.avatar = admin.avatar
  dialogOpen.value = true
}

function closeDialog() {
  dialogOpen.value = false
  resetForm()
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast({title: 'File size must be less than 5MB'})
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast({
        title:"Invalid File Type",
        description: 'Please select a valid image file'
})
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    form.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function onSubmit() {
  // Basic validation
  if (!form.name.trim()) {
    toast({
        title:"Name is Required"
    })
    return
  }
  
  if (!form.email.trim()) {
    toast({title:'Email is required'})
    return
  }
  
  if (form.age < 18 || form.age > 100) {
    toast({title:'Age must be between 18 and 100'})
    return
  }
  
  // Check for duplicate email (excluding current admin when editing)
  const existingAdmin = admins.value.find(admin => 
    admin.email.toLowerCase() === form.email.toLowerCase() && 
    admin.id !== editingAdmin.value?.id
  )
  
  if (existingAdmin) {
    toast({title:'An admin with this email already exists'})
    return
  }
  
  if (editingAdmin.value) {
    adminStore.updateAdmin(editingAdmin.value.id, { ...form })
  } else {
    adminStore.addAdmin({ ...form })
  }
  
  closeDialog()
}

function openDeleteDialog(admin: Admin) {
  deletingAdmin.value = admin
  deleteDialogOpen.value = true
}

function confirmDelete() {
  if (deletingAdmin.value) {
    adminStore.deleteAdmin(deletingAdmin.value.id)
    deletingAdmin.value = null
  }
  deleteDialogOpen.value = false
}
</script>
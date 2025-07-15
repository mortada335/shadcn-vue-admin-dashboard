
<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast'
import type { Admin, AdminFormData } from '@/types/admins'

const props = defineProps<{
  open: boolean
  admin?: Admin | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [data: AdminFormData]
}>()

const { toast } = useToast()

const isEditing = computed(() => !!props.admin)

const form = reactive<AdminFormData>({
  name: '',
  email: '',
  age: 18,
  isActive: true,
  avatar: '',
  role: 'admin'
})

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.age = 18
  form.isActive = true
  form.avatar = ''
  form.role = 'admin'
}
// Watch for admin prop changes to populate form
watch(() => props.admin, (admin) => {
  if (admin) {
    form.name = admin.name
    form.email = admin.email
    form.age = admin.age
    form.isActive = admin.isActive
    form.avatar = admin.avatar
    form.role = admin.role
  } else {
    resetForm()
  }
}, { immediate: true })



const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: 'File Too Large',
      description: 'File size must be less than 5MB',
      variant: 'destructive'
    })
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast({
      title: 'Invalid File Type',
      description: 'Please select a valid image file',
      variant: 'destructive'
    })
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    form.avatar = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const validateForm = (): boolean => {
  if (!form.name.trim()) {
    toast({
      title: 'Validation Error',
      description: 'Name is required',
      variant: 'destructive'
    })
    return false
  }

  if (!form.email.trim()) {
    toast({
      title: 'Validation Error',
      description: 'Email is required',
      variant: 'destructive'
    })
    return false
  }

  if (form.age < 18 || form.age > 100) {
    toast({
      title: 'Validation Error',
      description: 'Age must be between 18 and 100',
      variant: 'destructive'
    })
    return false
  }

  return true
}

const handleSubmit = () => {
  if (!validateForm()) return
  emit('submit', { ...form })
}
</script>
<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Edit Admin' : 'Add New Admin' }}</DialogTitle>
        <DialogDescription>
          {{ isEditing ? 'Update admin information below.' : 'Fill in the details to create a new admin.' }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="name">Name *</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Enter admin name"
              :disabled="loading"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="email">Email *</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter email address"
              :disabled="loading"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="age">Age *</Label>
            <Input
              id="age"
              v-model.number="form.age"
              type="number"
              min="18"
              max="100"
              placeholder="Enter age"
              :disabled="loading"
              required
            />
          </div>

          <div class="grid gap-2">
            <Label for="role">Role *</Label>
            <Select v-model="form.role" :disabled="loading">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              v-model:checked="form.isActive"
              :disabled="loading"
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
              :disabled="loading"
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
          <Button 
            type="button" 
            variant="outline" 
            @click="$emit('update:open', false)"
            :disabled="loading"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="loading">
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
            {{ isEditing ? 'Update Admin' : 'Create Admin' }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

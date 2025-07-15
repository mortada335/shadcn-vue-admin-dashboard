<template>
  <div class="container mx-auto py-10 px-5">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-4xl font-bold">Branches Management</h1>
        <p class="text-muted-foreground mt-2">Manage your organization's branches and locations</p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="h-4 w-4 mr-2" />
        Add Branch
      </Button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="flex-1">
        <Input
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search branches by name, location, or phone..."
        />
      </div>
      <Select v-model="statusFilter" @update:model-value="handleStatusFilter">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="branch in paginatedBranches" :key="branch.id">
            <TableCell class="font-medium">{{ branch.name }}</TableCell>
            <TableCell>{{ branch.location }}</TableCell>
            <TableCell>{{ branch.phoneNumber }}</TableCell>
            <TableCell>
              <Badge :variant="branch.status === 'active' ? 'default' : 'secondary'">
                {{ branch.status }}
              </Badge>
            </TableCell>
            <TableCell>{{ formatDate(branch.createdAt) }}</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button variant="ghost" size="icon" @click="openEditDialog(branch)">
                  <Pencil class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" @click="openDeleteDialog(branch)">
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="paginatedBranches.length === 0">
            <TableCell colspan="6" class="text-center py-8">
              <div class="text-muted-foreground">
                No branches found. Try adjusting your filters or create a new branch.
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-6">
      <div class="text-sm text-muted-foreground">
        Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredBranches.length) }} of
        {{ filteredBranches.length }} branches
      </div>
      <div class="flex items-center space-x-6 lg:space-x-8">
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium">Rows per page</p>
          <Select v-model="pageSize" @update:model-value="handlePageSizeChange">
            <SelectTrigger class="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {{ currentPage + 1 }} of {{ totalPages }}
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="icon" :disabled="currentPage === 0" @click="prevPage">
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" :disabled="currentPage >= totalPages - 1" @click="nextPage">
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit Branch' : 'Create New Branch' }}</DialogTitle>
          <DialogDescription>
            {{ isEditing ? 'Update the branch details below.' : 'Add a new branch to your organization.' }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="name">Branch Name *</Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="Enter branch name"
              :class="formErrors.name ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.name" class="text-sm text-red-500">{{ formErrors.name }}</p>
          </div>

          <div class="grid gap-2">
            <Label for="location">Location *</Label>
            <Input
              id="location"
              v-model="formData.location"
              placeholder="Enter branch location"
              :class="formErrors.location ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.location" class="text-sm text-red-500">{{ formErrors.location }}</p>
          </div>

          <div class="grid gap-2">
            <Label for="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              v-model="formData.phoneNumber"
              placeholder="Enter phone number"
              :class="formErrors.phoneNumber ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.phoneNumber" class="text-sm text-red-500">{{ formErrors.phoneNumber }}</p>
          </div>

          <div class="flex items-center space-x-2">
            <Switch id="status" v-model:checked="formData.status" />
            <Label for="status">{{ formData.status ? 'Active' : 'Inactive' }}</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showDialog = false">Cancel</Button>
          <Button @click="saveBranch" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isEditing ? 'Update' : 'Create' }} Branch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the branch
            <strong>"{{ selectedBranch?.name }}"</strong> and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isLoading">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="deleteBranch" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Delete Branch
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Toast -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBranchStore } from '@/views/branches/store/index'
import { useToast } from '@/components/ui/toast/use-toast'

// shadcn-vue components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Toaster } from '@/components/ui/toast'

// Icons
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-vue-next'

// Store and composables
const branchStore = useBranchStore()
const { toast } = useToast()

// Store state
const {
  branches,
  filteredBranches,
  searchQuery,
  statusFilter,
  currentPage,
  pageSize,
  totalPages,
  startIndex,
  endIndex,
  paginatedBranches,
  isLoading,
  formData,
  formErrors,
  selectedBranch,
  isEditing,
} = storeToRefs(branchStore)

// Local state for dialogs
const showDialog = ref(false)
const showDeleteDialog = ref(false)

// Watchers
watch([searchQuery, statusFilter], () => {
  branchStore.resetPage()
})

// Methods
const formatDate = (date: Date | undefined) => {
  return date ? new Date(date).toLocaleDateString() : ''
}

const handleSearch = () => {
  branchStore.resetPage()
}

const handleStatusFilter = () => {
  branchStore.resetPage()
}

const handlePageSizeChange = () => {
  branchStore.resetPage()
}

const nextPage = () => {
  branchStore.nextPage()
}

const prevPage = () => {
  branchStore.prevPage()
}

const openCreateDialog = () => {
  branchStore.openCreateDialog()
  showDialog.value = true
}

const openEditDialog = (branch: any) => {
  branchStore.openEditDialog(branch)
  showDialog.value = true
}

const openDeleteDialog = (branch: any) => {
  branchStore.setSelectedBranch(branch)
  showDeleteDialog.value = true
}

const saveBranch = async () => {
  const success = await branchStore.saveBranch()
  if (success) {
    showDialog.value = false
    toast({
      title: isEditing.value ? 'Branch Updated' : 'Branch Created',
      description: `${formData.value.name} has been ${isEditing.value ? 'updated' : 'created'} successfully.`,
    })
  } else {
    toast({
      title: 'Validation Error',
      description: 'Please fix the errors below and try again.',
      variant: 'destructive',
    })
  }
}

const deleteBranch = async () => {
  const branchName = selectedBranch.value?.name
  const success = await branchStore.deleteBranch()
  if (success) {
    showDeleteDialog.value = false
    toast({
      title: 'Branch Deleted',
      description: `${branchName} has been removed successfully.`,
    })
  } else {
    toast({
      title: 'Error',
      description: 'Failed to delete branch. Please try again.',
      variant: 'destructive',
    })
  }
}

</script>
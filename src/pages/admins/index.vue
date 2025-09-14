<template>
  <div class="container mx-auto p-6 space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">{{t("admin_management")}}</h1>
        <p class="text-muted-foreground">{{t("manage_your_admin_users_and_their_permissions")}}</p>
      </div>
      <Button @click="openAddDialog">
        <Plus class="w-4 h-4 mr-2" />
        {{t("add_admin")}}
      </Button>
    </div>

    <!-- Dashboard Stats -->
    <DashboardStats :stats="adminStore.dashboardStats" />

    <!-- Search and Filters -->
    <SearchAndFilters
      :search-query="adminStore.searchQuery"
      :filters="adminStore.selectedFilters"
      @search="adminStore.setSearch"
      @filter="adminStore.setFilters"
      @export="adminStore.exportAdmins"
    />

    <!-- Data Table -->
    <AdminDataTable
      :admins="adminStore.paginatedAdmins"
      @edit="openEditDialog"
      @delete="openDeleteDialog"
      @bulk-delete="openBulkDeleteDialog"
      @sort="handleSort"
    />

    <!-- Pagination -->
    <PaginationControls
      :pagination="adminStore.pagination"
      @page-change="adminStore.setPagination"
      @limit-change="handleLimitChange"
    />

    <!-- Add/Edit Dialog -->
    <AdminFormDialog
      v-model:open="formDialogOpen"
      :admin="editingAdmin"
      :loading="adminStore.loading"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmDialog
      v-model:open="deleteDialogOpen"
      :items="deletingItems"
      :loading="adminStore.loading"
      @confirm="handleDeleteConfirm"
    />

    <!-- Loading Overlay -->
    <div v-if="adminStore.loading" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card class="p-6">
        <div class="flex items-center gap-4">
          <Loader2 class="w-6 h-6 animate-spin" />
          <span>{{t("Processing...")}}</span>
        </div>
      </Card>
    </div>

    <!-- Toast Container -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast'

// Components
import DashboardStats from '@/views/admins/components/DashboardStats.vue'
import SearchAndFilters from '@/views/admins/components/SearchAndFilters.vue'
import AdminDataTable from '@/views/admins/components/AdminDataTable.vue'
import PaginationControls from '@/views/admins/components/PaginationControls.vue'
import AdminFormDialog from '@/views/admins/components/AdminFormDialog.vue'
import DeleteConfirmDialog from '@/views/admins/components/DeleteConfitrmDialog.vue'

// Store and Types
import { useAdminStore } from '@/views/admins/store/store'
import type { Admin, AdminFormData } from '@/types/admins'
import { useI18n } from 'vue-i18n'

// Initialize
const adminStore = useAdminStore()
const { toast } = useToast()
const { t } = useI18n()
// Dialog states
const formDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const editingAdmin = ref<Admin | null>(null)
const deletingItems = ref<Admin[] | null>(null)

// Dialog handlers
const openAddDialog = () => {
  editingAdmin.value = null
  formDialogOpen.value = true
}

const openEditDialog = (admin: Admin) => {
  editingAdmin.value = admin
  formDialogOpen.value = true
}

const openDeleteDialog = (admin: Admin) => {
  deletingItems.value = [admin]
  deleteDialogOpen.value = true
}

const openBulkDeleteDialog = (admins: Admin[]) => {
  deletingItems.value = admins
  deleteDialogOpen.value = true
}

// Form submission
const handleFormSubmit = async (formData: AdminFormData) => {
  let result

  if (editingAdmin.value) {
    result = await adminStore.updateAdmin(editingAdmin.value.id, formData)
  } else {
    result = await adminStore.addAdmin(formData)
  }

  if (result.success) {
    formDialogOpen.value = false
    toast({
      title: 'Success',
      description: editingAdmin.value ? 'Admin updated successfully' : 'Admin created successfully'
    })
  } else {
    toast({
      title: 'Error',
      description: result.error || 'Something went wrong',
      variant: 'destructive'
    })
  }
}

// Delete confirmation
const handleDeleteConfirm = async () => {
  if (!deletingItems.value) return

  let result

  if (deletingItems.value.length === 1) {
    result = await adminStore.deleteAdmin(deletingItems.value[0].id)
  } else {
    const ids = deletingItems.value.map(admin => admin.id)
    result = await adminStore.bulkDelete(ids)
  }

  if (result.success) {
    deleteDialogOpen.value = false
    toast({
      title: 'Success',
      description: `${deletingItems.value.length} admin(s) deleted successfully`
    })
  } else {
    toast({
      title: 'Error',
      description: result.error || 'Failed to delete admin(s)',
      variant: 'destructive'
    })
  }

  deletingItems.value = null
}

// Table sorting
const handleSort = (column: string) => {
  const currentOrder = adminStore.sortBy === column && adminStore.sortOrder === 'asc' ? 'desc' : 'asc'
  adminStore.setSorting(column, currentOrder)
}

// Pagination
const handleLimitChange = (limit: number) => {
  adminStore.setPagination(1, limit)
}
</script>
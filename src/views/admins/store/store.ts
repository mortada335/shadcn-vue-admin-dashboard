// import { defineStore } from "pinia"
// import { admins } from "./dummy"

// export interface Admin {
//   id: string
//   name: string
//   email: string
//   age: number
//   isActive: boolean
//   avatar: string
//   createdAt: Date
//   updatedAt: Date
// }


// export const useAdminStore = defineStore('admin',{
//         state:()=>({
//                 admins:admins as Admin[],
//                 nextId:1
//         }),
//         actions:{
//                 addAdmin(admin:Omit<Admin, 'id'>){
//                         this.admins.push({
//                                 ...admin,
//                                 id:this.nextId.toString(),
//                         })
//                         this.nextId++
//                 },
//                 updateAdmin(updatedAdmin:Admin){
//                         const index= this.admins.findIndex(a => a.id === updatedAdmin.id)
//                         if(index !== -1){
//                                 this.admins[index] = updatedAdmin
//                         }

//                 },
//                 deleteAdmin(id:number){
//                         this.admins =this.admins.filter(a=> a.id !== id.toString())
//                 }
//         }
// })

// Pinia Store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Admin, AdminFormData, PaginationData, DashboardStats, FilterOption } from '@/types/admins'

export const useAdminStore = defineStore('admin', () => {
  // State
  const admins = ref<Admin[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      isActive: true,
      avatar: '/placeholder.svg?height=40&width=40',
      role: 'admin',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 28,
      isActive: false,
      avatar: '',
      role: 'moderator',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      age: 35,
      isActive: true,
      avatar: '/placeholder.svg?height=40&width=40',
      role: 'super_admin',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ])

  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedFilters = ref<FilterOption[]>([])
  const sortBy = ref<string>('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const pagination = ref<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Getters
  const filteredAdmins = computed(() => {
    let filtered = admins.value

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(admin => 
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.role.toLowerCase().includes(query)
      )
    }

    // Additional filters
    selectedFilters.value.forEach(filter => {
      if (filter.key === 'status') {
        filtered = filtered.filter(admin => 
          filter.value === 'all' ? true : admin.isActive === (filter.value === 'active')
        )
      }
      if (filter.key === 'role') {
        filtered = filtered.filter(admin => 
          filter.value === 'all' ? true : admin.role === filter.value
        )
      }
    })

    // Sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy.value as keyof Admin]
      const bValue = b[sortBy.value as keyof Admin]
      
      if (sortOrder.value === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  })

  const paginatedAdmins = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.limit
    const end = start + pagination.value.limit
    const filtered = filteredAdmins.value
    
    pagination.value.total = filtered.length
    pagination.value.totalPages = Math.ceil(filtered.length / pagination.value.limit)
    
    return filtered.slice(start, end)
  })

  const dashboardStats = computed((): DashboardStats => {
    const total = admins.value.length
    const active = admins.value.filter(admin => admin.isActive).length
    const inactive = total - active
    const thisMonth = new Date()
    thisMonth.setMonth(thisMonth.getMonth())
    const newThisMonth = admins.value.filter(admin => 
      admin.createdAt >= thisMonth
    ).length

    return {
      totalAdmins: total,
      activeAdmins: active,
      inactiveAdmins: inactive,
      newThisMonth
    }
  })

  // Actions
  const addAdmin = async (adminData: AdminFormData) => {
    loading.value = true
    error.value = null
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newAdmin: Admin = {
        ...adminData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      admins.value.push(newAdmin)
      return { success: true, data: newAdmin }
    } catch (err) {
      error.value = 'Failed to add admin'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateAdmin = async (id: string, adminData: Partial<AdminFormData>) => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const index = admins.value.findIndex(admin => admin.id === id)
      if (index !== -1) {
        admins.value[index] = {
          ...admins.value[index],
          ...adminData,
          updatedAt: new Date()
        }
        return { success: true, data: admins.value[index] }
      }
      throw new Error('Admin not found')
    } catch (err) {
      error.value = 'Failed to update admin'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteAdmin = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const index = admins.value.findIndex(admin => admin.id === id)
      if (index !== -1) {
        const deletedAdmin = admins.value.splice(index, 1)[0]
        return { success: true, data: deletedAdmin }
      }
      throw new Error('Admin not found')
    } catch (err) {
      error.value = 'Failed to delete admin'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const bulkDelete = async (ids: string[]) => {
    loading.value = true
    error.value = null
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const deletedAdmins = admins.value.filter(admin => ids.includes(admin.id))
      admins.value = admins.value.filter(admin => !ids.includes(admin.id))
      
      return { success: true, data: deletedAdmins }
    } catch (err) {
      error.value = 'Failed to delete admins'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const exportAdmins = () => {
    const csvContent = [
      ['Name', 'Email', 'Age', 'Status', 'Role', 'Created At'].join(','),
      ...filteredAdmins.value.map(admin => [
        admin.name,
        admin.email,
        admin.age,
        admin.isActive ? 'Active' : 'Inactive',
        admin.role,
        admin.createdAt.toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admins-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Utility functions
  const setSearch = (query: string) => {
    searchQuery.value = query
    pagination.value.page = 1
  }

  const setFilters = (filters: FilterOption[]) => {
    selectedFilters.value = filters
    pagination.value.page = 1
  }

  const setSorting = (column: string, order: 'asc' | 'desc') => {
    sortBy.value = column
    sortOrder.value = order
  }

  const setPagination = (page: number, limit?: number) => {
    pagination.value.page = page
    if (limit) pagination.value.limit = limit
  }

  const getAdminById = (id: string) => {
    return admins.value.find(admin => admin.id === id)
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    admins,
    loading,
    error,
    searchQuery,
    selectedFilters,
    sortBy,
    sortOrder,
    pagination,
    
    // Getters
    filteredAdmins,
    paginatedAdmins,
    dashboardStats,
    
    // Actions
    addAdmin,
    updateAdmin,
    deleteAdmin,
    bulkDelete,
    exportAdmins,
    setSearch,
    setFilters,
    setSorting,
    setPagination,
    getAdminById,
    clearError
  }
})
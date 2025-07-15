// stores/branchStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Branch, BranchFormData } from '@/types/branches'
import { branchesData } from '@/views/branches/store/dummy'

export const useBranchStore = defineStore('branch', () => {
  // State
  const branches = ref<Branch[]>(branchesData)
  const searchQuery = ref('')
  const statusFilter = ref('all')
  const currentPage = ref(0)
  const pageSize = ref(5)
  const isLoading = ref(false)
  const selectedBranch = ref<Branch | null>(null)
  const isEditing = ref(false)
  
  const formData = ref<BranchFormData>({
    name: '',
    location: '',
    phoneNumber: '',
    status: true,
  })
  
  const formErrors = ref<Record<string, string>>({})

  // Computed
  const filteredBranches = computed(() => {
    return branches.value.filter((branch) => {
      const matchesSearch =
        branch.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        branch.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        branch.phoneNumber.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesStatus = statusFilter.value === 'all' || branch.status === statusFilter.value

      return matchesSearch && matchesStatus
    })
  })

  const totalPages = computed(() => Math.ceil(filteredBranches.value.length / pageSize.value))
  const startIndex = computed(() => currentPage.value * pageSize.value)
  const endIndex = computed(() => startIndex.value + pageSize.value)
  const paginatedBranches = computed(() =>
    filteredBranches.value.slice(startIndex.value, endIndex.value)
  )



  const resetPage = () => {
    currentPage.value = 0
  }

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

  const setSelectedBranch = (branch: Branch) => {
    selectedBranch.value = branch
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.value.name.trim()) {
      errors.name = 'Branch name is required'
    } else if (formData.value.name.trim().length < 2) {
      errors.name = 'Branch name must be at least 2 characters'
    }

    if (!formData.value.location.trim()) {
      errors.location = 'Location is required'
    } else if (formData.value.location.trim().length < 3) {
      errors.location = 'Location must be at least 3 characters'
    }

    if (!formData.value.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required'
    } else if (!/^[+]?[0-9\s\-()]{10,}$/.test(formData.value.phoneNumber.trim())) {
      errors.phoneNumber = 'Please enter a valid phone number'
    }

    // Check for duplicate names
    const duplicateName = branches.value.find(
      (branch) =>
        branch.name.toLowerCase() === formData.value.name.trim().toLowerCase() &&
        (!isEditing.value || branch.id !== selectedBranch.value?.id)
    )
    if (duplicateName) {
      errors.name = 'A branch with this name already exists'
    }

    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  const openCreateDialog = () => {
    isEditing.value = false
    selectedBranch.value = null
    formData.value = {
      name: '',
      location: '',
      phoneNumber: '',
      status: true,
    }
    formErrors.value = {}
  }

  const openEditDialog = (branch: Branch) => {
    isEditing.value = true
    selectedBranch.value = branch
    formData.value = {
      name: branch.name,
      location: branch.location,
      phoneNumber: branch.phoneNumber,
      status: branch.status === 'active',
    }
    formErrors.value = {}
  }

  const saveBranch = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false
    }

    isLoading.value = true

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const branchData = {
        name: formData.value.name.trim(),
        location: formData.value.location.trim(),
        phoneNumber: formData.value.phoneNumber.trim(),
        status: formData.value.status ? 'active' : 'inactive' as 'active' | 'inactive',
        updatedAt: new Date(),
      }

      if (isEditing.value && selectedBranch.value) {
        // Update existing branch
        const index = branches.value.findIndex((b) => b.id === selectedBranch.value!.id)
        if (index !== -1) {
          branches.value[index] = {
            ...branches.value[index],
            ...branchData,
          }
        }
      } else {
        // Create new branch
        const newBranch: Branch = {
          id: Math.max(...branches.value.map((b) => b.id), 0) + 1,
          ...branchData,
          createdAt: new Date(),
        }
        branches.value.push(newBranch)
      }

      return true
    } catch (error) {
      return false
    } finally {
      isLoading.value = false
    }
  }

  const deleteBranch = async (): Promise<boolean> => {
    if (!selectedBranch.value) return false

    isLoading.value = true

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      branches.value = branches.value.filter((branch) => branch.id !== selectedBranch.value!.id)
      selectedBranch.value = null

      return true
    } catch (error) {
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    branches,
    searchQuery,
    statusFilter,
    currentPage,
    pageSize,
    isLoading,
    selectedBranch,
    isEditing,
    formData,
    formErrors,
    
    // Computed
    filteredBranches,
    totalPages,
    startIndex,
    endIndex,
    paginatedBranches,
    
    // Actions
    resetPage,
    nextPage,
    prevPage,
    setSelectedBranch,
    openCreateDialog,
    openEditDialog,
    saveBranch,
    deleteBranch,
  }
})
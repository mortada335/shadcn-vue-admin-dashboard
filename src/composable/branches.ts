// composables/useBranchValidation.ts - Advanced Validation Composable
import { ref, computed } from 'vue'
import type { BranchFormData, ValidationError } from '@/types/branches'

export function useBranchValidation() {
  const errors = ref<Record<string, string>>({})
  const validationErrors = ref<ValidationError[]>([])
  
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const errorCount = computed(() => Object.keys(errors.value).length)
  
  // Validation rules
  const rules = {
    required: (value: any, fieldName: string) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return `${fieldName} is required`
      }
      return null
    },
    
    email: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        return 'Please enter a valid email address'
      }
      return null
    },
    
    phone: (value: string) => {
      const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/
      if (value && !phoneRegex.test(value)) {
        return 'Please enter a valid phone number'
      }
      return null
    },
    
    url: (value: string) => {
      try {
        if (value) new URL(value)
        return null
      } catch {
        return 'Please enter a valid URL'
      }
    },
    
    minLength: (value: string, min: number) => {
      if (value && value.trim().length < min) {
        return `Must be at least ${min} characters long`
      }
      return null
    },
    
    maxLength: (value: string, max: number) => {
      if (value && value.trim().length > max) {
        return `Must be no more than ${max} characters long`
      }
      return null
    },
    
    min: (value: number, min: number) => {
      if (value < min) {
        return `Must be at least ${min}`
      }
      return null
    },
    
    max: (value: number, max: number) => {
      if (value > max) {
        return `Must be no more than ${max}`
      }
      return null
    },
    
    positive: (value: number) => {
      if (value < 0) {
        return 'Must be a positive number'
      }
      return null
    }
  }
  
  const validateField = (
    value: any, 
    fieldName: string, 
    validationRules: Array<(value: any) => string | null>
  ): string | null => {
    for (const rule of validationRules) {
      const error = rule(value)
      if (error) return error
    }
    return null
  }
  
  const validateBranchForm = (
    formData: BranchFormData, 
    existingBranches: any[] = [], 
    editingId?: number
  ): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Basic Information Validation
    const nameError = validateField(formData.name, 'Name', [
      (v) => rules.required(v, 'Branch name'),
      (v) => rules.minLength(v, 2),
      (v) => rules.maxLength(v, 100)
    ])
    if (nameError) newErrors.name = nameError
    
    const emailError = validateField(formData.email, 'Email', [
      (v) => rules.required(v, 'Email'),
      (v) => rules.email(v)
    ])
    if (emailError) newErrors.email = emailError
    
    const phoneError = validateField(formData.phoneNumber, 'Phone', [
      (v) => rules.required(v, 'Phone number'),
      (v) => rules.phone(v)
    ])
    if (phoneError) newErrors.phoneNumber = phoneError
    
    // Address Validation
    const streetError = validateField(formData.street, 'Street', [
      (v) => rules.required(v, 'Street address'),
      (v) => rules.minLength(v, 5)
    ])
    if (streetError) newErrors.street = streetError
    
    const cityError = validateField(formData.city, 'City', [
      (v) => rules.required(v, 'City'),
      (v) => rules.minLength(v, 2)
    ])
    if (cityError) newErrors.city = cityError
    
    const countryError = validateField(formData.country, 'Country', [
      (v) => rules.required(v, 'Country')
    ])
    if (countryError) newErrors.country = countryError
    
    // Financial Validation
    const budgetError = validateField(formData.budget, 'Budget', [
      (v) => rules.positive(v),
      (v) => rules.max(v, 100000000)
    ])
    if (budgetError) newErrors.budget = budgetError
    
    const revenueError = validateField(formData.revenue, 'Revenue', [
      (v) => rules.positive(v),
      (v) => rules.max(v, 100000000)
    ])
    if (revenueError) newErrors.revenue = revenueError
    
    // Operational Validation
    const capacityError = validateField(formData.capacity, 'Capacity', [
      (v) => rules.min(v, 1),
      (v) => rules.max(v, 10000)
    ])
    if (capacityError) newErrors.capacity = capacityError
    
    if (formData.currentOccupancy > formData.capacity) {
      newErrors.currentOccupancy = 'Current occupancy cannot exceed capacity'
    }
    
    // Manager Validation
    if (formData.managerId > 0) {
      const managerNameError = validateField(formData.managerName, 'Manager Name', [
        (v) => rules.required(v, 'Manager name'),
        (v) => rules.minLength(v, 2)
      ])
      if (managerNameError) newErrors.managerName = managerNameError
      
      const managerEmailError = validateField(formData.managerEmail, 'Manager Email', [
        (v) => rules.required(v, 'Manager email'),
        (v) => rules.email(v)
      ])
      if (managerEmailError) newErrors.managerEmail = managerEmailError
      
      const managerPhoneError = validateField(formData.managerPhone, 'Manager Phone', [
        (v) => rules.required(v, 'Manager phone'),
        (v) => rules.phone(v)
      ])
      if (managerPhoneError) newErrors.managerPhone = managerPhoneError
    }
    
    // Website Validation
    if (formData.website) {
      const websiteError = validateField(formData.website, 'Website', [
        (v) => rules.url(v)
      ])
      if (websiteError) newErrors.website = websiteError
    }
    
    // Duplicate Checks
    const duplicateName = existingBranches.find(
      (branch) =>
        branch.name.toLowerCase() === formData.name.trim().toLowerCase() &&
        branch.id !== editingId
    )
    if (duplicateName) {
      newErrors.name = 'A branch with this name already exists'
    }
    
    const duplicateEmail = existingBranches.find(
      (branch) =>
        branch.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        branch.id !== editingId
    )
    if (duplicateEmail) {
      newErrors.email = 'A branch with this email already exists'
    }
    
    // Working Hours Validation
    const workingHoursErrors = validateWorkingHours(formData.workingHours)
    Object.assign(newErrors, workingHoursErrors)
    
    errors.value = newErrors
    
    // Create detailed validation errors
    validationErrors.value = Object.entries(newErrors).map(([field, message]) => ({
      field,
      message,
      code: 'VALIDATION_ERROR'
    }))
    
    return Object.keys(newErrors).length === 0
  }
  
  const validateWorkingHours = (workingHours: any): Record<string, string> => {
    const errors: Record<string, string> = {}
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    
    for (const day of days) {
      const schedule = workingHours[day]
      if (!schedule.isClosed) {
        if (!schedule.open || !schedule.close) {
          errors[`workingHours.${day}`] = `${day} working hours are incomplete`
        } else if (schedule.open >= schedule.close) {
          errors[`workingHours.${day}`] = `${day} opening time must be before closing time`
        }
      }
    }
    
    return errors
  }
  
  const validateCoordinates = (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  }
  
  const validateFileUpload = (file: File, maxSize: number = 5 * 1024 * 1024): string | null => {
    if (file.size > maxSize) {
      return `File size must be less than ${maxSize / (1024 * 1024)}MB`
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported'
    }
    
    return null
  }
  
  const clearErrors = () => {
    errors.value = {}
    validationErrors.value = []
  }
  
  const clearFieldError = (field: string) => {
    delete errors.value[field]
    validationErrors.value = validationErrors.value.filter(e => e.field !== field)
  }
  
  const addError = (field: string, message: string) => {
    errors.value[field] = message
    validationErrors.value.push({
      field,
      message,
      code: 'CUSTOM_ERROR'
    })
  }
  
  return {
    errors,
    validationErrors,
    hasErrors,
    errorCount,
    validateBranchForm,
    validateWorkingHours,
    validateCoordinates,
    validateFileUpload,
    clearErrors,
    clearFieldError,
    addError,
    rules
  }
}
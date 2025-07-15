// utils/branchHelpers.ts - Utility Functions
import type { Branch, WorkingHours } from '@/types/branches'

export const branchHelpers = {
  // Format currency
  formatCurrency: (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  },
  
  // Format date
  formatDate: (date: Date | string): string => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },
  
  // Format date and time
  formatDateTime: (date: Date | string): string => {
    const d = new Date(date)
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },
  
  // Calculate distance between coordinates
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  },
  
  // Check if branch is currently open
  isCurrentlyOpen: (workingHours: WorkingHours, timezone: string = 'Asia/Baghdad'): boolean => {
    const now = new Date()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const currentDay = dayNames[now.getDay()] as keyof WorkingHours
    const schedule = workingHours[currentDay]
    
    if (schedule.isClosed) return false
    
    const currentTime = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: timezone 
    }).slice(0, 5)
    
    return currentTime >= schedule.open && currentTime <= schedule.close
  },
  
  // Get next opening time
  getNextOpeningTime: (workingHours: WorkingHours): string => {
    const now = new Date()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(now)
      checkDate.setDate(now.getDate() + i)
      const dayName = dayNames[checkDate.getDay()] as keyof WorkingHours
      const schedule = workingHours[dayName]
      
      if (!schedule.isClosed) {
        if (i === 0) {
          // Today - check if still time to open
          const currentTime = now.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)
          if (currentTime < schedule.open) {
            return `Today at ${schedule.open}`
          }
        } else {
          const dayName = checkDate.toLocaleDateString('en-US', { weekday: 'long' })
          return `${dayName} at ${schedule.open}`
        }
      }
    }
    
    return 'Closed indefinitely'
  },
  
  // Calculate occupancy percentage
  calculateOccupancyRate: (current: number, capacity: number): number => {
    if (capacity === 0) return 0
    return Math.round((current / capacity) * 100)
  },
  
  // Get status color
  getStatusColor: (status: Branch['status']): string => {
    const colors = {
      active: 'green',
      inactive: 'gray',
      pending: 'yellow',
      suspended: 'orange',
      closed: 'red'
    }
    return colors[status] || 'gray'
  },
  
  // Get priority color
  getPriorityColor: (priority: Branch['priority']): string => {
    const colors = {
      high: 'red',
      medium: 'yellow',
      low: 'green'
    }
    return colors[priority] || 'gray'
  },
  
  // Generate branch code
  generateBranchCode: (existingBranches: Branch[]): string => {
    const maxId = Math.max(...existingBranches.map(b => b.id), 0)
    return `BR${String(maxId + 1).padStart(3, '0')}`
  },
  
  // Validate coordinates
  isValidCoordinates: (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  },
  
  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },
  
  // Generate UUID
  generateUUID: (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c == 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  },
  
  // Slugify text
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  },
  
  // Truncate text
  truncate: (text: string, length: number = 50): string => {
    if (text.length <= length) return text
    return text.slice(0, length) + '...'
  },
  
  // Deep clone object
  deepClone: <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
  },
  
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }
}

// Export individual functions for convenience
export const {
  formatCurrency,
  formatDate,
  formatDateTime,
  calculateDistance,
  isCurrentlyOpen,
  getNextOpeningTime,
  calculateOccupancyRate,
  getStatusColor,
  getPriorityColor,
  generateBranchCode,
  isValidCoordinates,
  formatFileSize,
  generateUUID,
  slugify,
  truncate,
  deepClone,
  debounce
} = branchHelpers
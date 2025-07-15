export interface Admin {
  id: string
  name: string
  email: string
  age: number
  isActive: boolean
  avatar: string
  role: 'admin' | 'super_admin' | 'moderator'
  createdAt: Date
  updatedAt: Date
}

export interface AdminFormData {
  name: string
  email: string
  age: number
  isActive: boolean
  avatar: string
  role: 'admin' | 'super_admin' | 'moderator'
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface FilterOption {
  key: string
  label: string
  value: any
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface DashboardStats {
  totalAdmins: number
  activeAdmins: number
  inactiveAdmins: number
  newThisMonth: number
}
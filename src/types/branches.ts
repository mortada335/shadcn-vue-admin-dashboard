// types/branch.ts
export interface Branch {
  id: number
  name: string
  location: string
  phoneNumber: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

export interface BranchFormData {
  name: string
  location: string
  phoneNumber: string
  status: boolean
}
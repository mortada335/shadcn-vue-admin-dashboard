// data/branches.ts
import type { Branch } from '@/types/branches'

export const branchesData: Branch[] = [
  {
    id: 1,
    name: 'Main Branch',
    location: 'Baghdad, Iraq',
    phoneNumber: '+964 770 123 4567',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    name: 'North Branch',
    location: 'Erbil, Iraq',
    phoneNumber: '+964 750 987 6543',
    status: 'inactive',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 3,
    name: 'South Branch',
    location: 'Basra, Iraq',
    phoneNumber: '+964 780 555 0123',
    status: 'active',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
  {
    id: 4,
    name: 'East Branch',
    location: 'Sulaymaniyah, Iraq',
    phoneNumber: '+964 760 444 5555',
    status: 'active',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01'),
  },
  {
    id: 5,
    name: 'West Branch',
    location: 'Anbar, Iraq',
    phoneNumber: '+964 740 333 2222',
    status: 'inactive',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-05-15'),
  },
]
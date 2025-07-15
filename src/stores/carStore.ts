import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Car, CarFilters, PaginationState } from '@/types/car'

// Dummy data
const dummyCars: Car[] = [
        {
                id: 1,
                brand: 'Toyota',
                model: 'Camry',
                year: 2022,
                color: 'Silver',
                price: 25000,
                mileage: 15000,
                fuelType: 'petrol',
                transmission: 'automatic',
                status: 'available'
        },
        {
                id: 2,
                brand: 'Honda',
                model: 'Civic',
                year: 2021,
                color: 'Blue',
                price: 22000,
                mileage: 20000,
                fuelType: 'petrol',
                transmission: 'manual',
                status: 'available'
        },
        {
                id: 3,
                brand: 'Tesla',
                model: 'Model 3',
                year: 2023,
                color: 'White',
                price: 45000,
                mileage: 5000,
                fuelType: 'electric',
                transmission: 'automatic',
                status: 'available'
        },
        {
                id: 4,
                brand: 'BMW',
                model: '3 Series',
                year: 2022,
                color: 'Black',
                price: 42000,
                mileage: 12000,
                fuelType: 'petrol',
                transmission: 'automatic',
                status: 'available'
        },
        {
                id: 5,
                brand: 'Mercedes',
                model: 'C-Class',
                year: 2023,
                color: 'Gray',
                price: 48000,
                mileage: 8000,
                fuelType: 'hybrid',
                transmission: 'automatic',
                status: 'available'
        }
]

export const useCarStore = defineStore('car', () => {
        const cars = ref<Car[]>(dummyCars)
        const filters = ref<CarFilters>({
                search: '',
                brand: '',
                year: null,
                priceRange: [0, 100000],
                fuelType: '',
                transmission: '',
                status: ''
        })
        const pagination = ref<PaginationState>({
                page: 1,
                pageSize: 10,
                totalItems: 0
        })

        // Computed properties
        const filteredCars = computed(() => {
                let result = [...cars.value]

                // Apply search filter
                if (filters.value.search) {
                        const searchLower = filters.value.search.toLowerCase()
                        result = result.filter(car =>
                                car.brand.toLowerCase().includes(searchLower) ||
                                car.model.toLowerCase().includes(searchLower)
                        )
                }

                // Apply other filters
                if (filters.value.brand) {
                        result = result.filter(car => car.brand === filters.value.brand)
                }
                if (filters.value.year) {
                        result = result.filter(car => car.year === filters.value.year)
                }
                if (filters.value.fuelType) {
                        result = result.filter(car => car.fuelType === filters.value.fuelType)
                }
                if (filters.value.transmission) {
                        result = result.filter(car => car.transmission === filters.value.transmission)
                }
                if (filters.value.status) {
                        result = result.filter(car => car.status === filters.value.status)
                }

                // Apply price range filter
                result = result.filter(car =>
                        car.price >= filters.value.priceRange[0] &&
                        car.price <= filters.value.priceRange[1]
                )

                // Update total items for pagination
                pagination.value.totalItems = result.length

                // Apply pagination
                const start = (pagination.value.page - 1) * pagination.value.pageSize
                const end = start + pagination.value.pageSize
                return result.slice(start, end)
        })

        // Actions
        function addCar(car: Omit<Car, 'id'>) {
                const newCar = {
                        ...car,
                        id: Math.max(...cars.value.map(c => c.id)) + 1
                }
                cars.value.push(newCar)
        }

        function updateCar(id: number, car: Partial<Car>) {
                const index = cars.value.findIndex(c => c.id === id)
                if (index !== -1) {
                        cars.value[index] = { ...cars.value[index], ...car }
                }
        }

        function deleteCar(id: number) {
                cars.value = cars.value.filter(car => car.id !== id)
        }

        function setFilters(newFilters: Partial<CarFilters>) {
                filters.value = { ...filters.value, ...newFilters }
                pagination.value.page = 1 // Reset to first page when filters change
        }

        function setPagination(newPagination: Partial<PaginationState>) {
                pagination.value = { ...pagination.value, ...newPagination }
        }

        return {
                cars,
                filters,
                pagination,
                filteredCars,
                addCar,
                updateCar,
                deleteCar,
                setFilters,
                setPagination
        }
}) 
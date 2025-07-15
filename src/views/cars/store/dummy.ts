import type { Car } from "@/types/car"
export const dummyCars: Car[] = [
        {
                id: 1,
                brand: 'Toyota',
                img:"",
                model: 'Camry',
                year: 2022,
                color: 'Silver',
                price: 25000,
                mileage: 15000,
                fuelType: 'petrol',
                transmission: 'automatic',
                status: 'available',
                createdAt: new Date('2023-02-05'),
                updatedAt: new Date('2023-02-06')
        },
        {
                id: 2,
                brand: 'Honda',
                img:"",
                model: 'Civic',
                year: 2021,
                color: 'Blue',
                price: 22000,
                mileage: 20000,
                fuelType: 'petrol',
                transmission: 'manual',
                status: 'sold',
                createdAt: new Date('2023-02-05'),
                updatedAt: new Date('2023-02-06')
        },
        {
                id: 3,
                brand: 'Tesla',
                img:"",
                model: 'Model 3',
                year: 2023,
                color: 'White',
                price: 45000,
                mileage: 5000,
                fuelType: 'electric',
                transmission: 'automatic',
                status: 'available',
                createdAt: new Date('2023-02-05'),
                updatedAt: new Date('2023-02-06')
        },
        {
                id: 4,
                brand: 'Toyota',
                img:"",
                model: 'Corolla',
                year: 2000,
                color: 'red',
                price: 20000,
                mileage: 100,
                fuelType: 'petrol',
                transmission: 'automatic',
                status: 'sold',
                createdAt: new Date('2023-02-05'),
                updatedAt: new Date('2023-02-06')
        }
]
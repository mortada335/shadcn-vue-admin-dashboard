export interface Car {
        id: number
        img: string
        brand: string
        model: string
        year: number
        color: string
        price: number
        mileage: number
        fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
        transmission: 'manual' | 'automatic'
        status: 'available' | 'sold'
        createdAt: Date
        updatedAt: Date
}

export interface CarFilters {
        search: string
        brand: string
        year: number | null
        priceRange: [number, number]
        fuelType: string
        transmission: string
        status: string
        [key : string]:any
}

export interface PaginationState {
        page: number
        pageSize: number
        totalItems: number
} 

export interface CarFormData {
        img: string
        brand: string
        model:string
        year:number
        color:string
        price: number
        mileage:number
        fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
        transmission: 'manual' | 'automatic'
        status:boolean
}
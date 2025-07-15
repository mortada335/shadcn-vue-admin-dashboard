import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Car, CarFormData } from "@/types/car";
import { dummyCars } from "@/views/cars/store/dummy";

export const useCarStore = defineStore("car", () => {
  // State
  const cars = ref<Car[]>(dummyCars);
  const searchQuery = ref("");
  const currentCar = ref<Car | null>(null);
  const statusFilter = ref("all");
  const sortBy = ref("createdAt");
  const sortOrder = ref<"asc" | "desc">("desc");
  const currentPage = ref(0);
  const pageSize = ref(10);
  const isLoading = ref(false);
  const selectedCar = ref<Car | null>(null);
  const isEditing = ref(false);

  // Form state
  const formData = ref<CarFormData>({
    img: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    price: 0,
    mileage: 0,
    fuelType: "petrol",
    transmission: "automatic",
    status: true,
  });

  const formErrors = ref<Record<string, string>>({});

  // Computed properties
  const filteredCars = computed(() => {
    let filtered = cars.value.filter((car) => {
      // Search filter
      const searchLower = searchQuery.value.toLowerCase();
      const matchesSearch = !searchQuery.value || 
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.color.toLowerCase().includes(searchLower) ||
        car.fuelType.toLowerCase().includes(searchLower) ||
        car.transmission.toLowerCase().includes(searchLower) ||
        car.year.toString().includes(searchQuery.value) ||
        car.price.toString().includes(searchQuery.value);

      // Status filter
      const matchesStatus = statusFilter.value === "all" || 
        car.status === statusFilter.value;

      return matchesSearch && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy.value as keyof Car];
      let bValue: any = b[sortBy.value as keyof Car];

      // Handle date sorting
      if (sortBy.value === 'createdAt' || sortBy.value === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder.value === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  });

  const totalPages = computed(() =>
    Math.ceil(filteredCars.value.length / pageSize.value)
  );

  const startIndex = computed(() => currentPage.value * pageSize.value);
  const endIndex = computed(() => startIndex.value + pageSize.value);

  const paginatedCars = computed(() =>
    filteredCars.value.slice(startIndex.value, endIndex.value)
  );

  // Actions
  const resetPage = () => {
    currentPage.value = 0;
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 0) {
      currentPage.value--;
    }
  };

  const setSelectedCar = (car: Car) => {
    selectedCar.value = car;
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Brand validation
    if (!formData.value.brand.trim()) {
      errors.brand = "Brand is required";
    } else if (formData.value.brand.trim().length < 2) {
      errors.brand = "Brand must be at least 2 characters";
    }

    // Model validation
    if (!formData.value.model.trim()) {
      errors.model = "Model is required";
    } else if (formData.value.model.trim().length < 1) {
      errors.model = "Model must be at least 1 character";
    }

    // Year validation
    const currentYear = new Date().getFullYear();
    if (!formData.value.year || isNaN(formData.value.year)) {
      errors.year = "Year is required";
    } else if (
      formData.value.year < 1886 ||
      formData.value.year > currentYear + 1
    ) {
      errors.year = `Year must be between 1886 and ${currentYear + 1}`;
    }

    // Color validation
    if (!formData.value.color.trim()) {
      errors.color = "Color is required";
    }

    // Price validation
    if (formData.value.price === undefined || formData.value.price === null) {
      errors.price = "Price is required";
    } else if (formData.value.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    // Mileage validation
    if (formData.value.mileage === undefined || formData.value.mileage === null) {
      errors.mileage = "Mileage is required";
    } else if (formData.value.mileage < 0) {
      errors.mileage = "Mileage cannot be negative";
    }

    // Fuel type validation
    if (!formData.value.fuelType.trim()) {
      errors.fuelType = "Fuel type is required";
    }

    // Transmission validation
    if (!formData.value.transmission.trim()) {
      errors.transmission = "Transmission is required";
    }

    // Check for duplicate model (only if not editing or editing different car)
    const duplicateModel = cars.value.find((car) => 
      car.model.toLowerCase() === formData.value.model.trim().toLowerCase() &&
      car.brand.toLowerCase() === formData.value.brand.trim().toLowerCase() &&
      (!isEditing.value || car.id !== selectedCar.value?.id)
    );

    if (duplicateModel) {
      errors.model = "A car with this brand and model already exists";
    }

    formErrors.value = errors;
    return Object.keys(errors).length === 0;
  };

  // Dialog actions
  const openCreateDialog = () => {
    isEditing.value = false;
    selectedCar.value = null;
    formData.value = {
      img: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      price: 0,
      mileage: 0,
      fuelType: "petrol",
      transmission: "automatic",
      status: true,
    };
    formErrors.value = {};
  };

  const openEditDialog = (car: Car) => {
    isEditing.value = true;
    selectedCar.value = car;
    formData.value = {
      img: car.img || "",
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      price: car.price,
      mileage: car.mileage,
      fuelType: car.fuelType,
      transmission: car.transmission,
      status: car.status === "available",
    };
    formErrors.value = {};
  };

  // CRUD operations
  const saveCar = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    isLoading.value = true;
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const carData = {
        img: formData.value.img,
        brand: formData.value.brand.trim(),
        model: formData.value.model.trim(),
        year: formData.value.year,
        color: formData.value.color.trim(),
        price: formData.value.price,
        mileage: formData.value.mileage,
        fuelType: formData.value.fuelType as "electric" | "petrol" | "hybrid" | "diesel",
        transmission: formData.value.transmission as "automatic" | "manual",
        status: formData.value.status ? "available" : "sold" as "available" | "sold",
        updatedAt: new Date(),
      };

      if (isEditing.value && selectedCar.value) {
        // Update existing car
        const index = cars.value.findIndex((c) => c.id === selectedCar.value!.id);
        if (index !== -1) {
          cars.value[index] = {
            ...cars.value[index],
            ...carData,
          };
        }
      } else {
        // Create new car
        const newCar: Car = {
          id: Math.max(...cars.value.map((c) => c.id), 0) + 1,
          ...carData,
          createdAt: new Date(),
        };
        cars.value.unshift(newCar); // Add to beginning for better UX
      }

      return true;
    } catch (error) {
      console.error('Error saving car:', error);
      return false;
    } finally {
      isLoading.value = false; // Fixed: was setting to true
    }
  };

  const deleteCar = async (): Promise<boolean> => {
    if (!selectedCar.value) return false;

    isLoading.value = true;
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      cars.value = cars.value.filter((car) => car.id !== selectedCar.value!.id);
      selectedCar.value = null;
      
      return true;
    } catch (error) {
      console.error('Error deleting car:', error);
      return false;
    } finally {
      isLoading.value = false; // Fixed: was setting to true
    }
  };

  return {
    // State
    cars,
    searchQuery,
    selectedCar,
    statusFilter,
    sortBy,
    sortOrder,
    currentPage,
    currentCar,
    pageSize,
    isLoading,
    isEditing,
    formData,
    formErrors,
    
    // Computed
    totalPages,
    startIndex,
    endIndex,
    paginatedCars,
    filteredCars,
    
    // Actions
    nextPage,
    prevPage,
    resetPage,
    setSelectedCar,
    openCreateDialog,
    openEditDialog,
    saveCar,
    deleteCar,
  };
});
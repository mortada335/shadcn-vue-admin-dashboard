import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Car,
  CarFilters,
  PaginationState,
  CarFormData,
} from "@/types/car";
import { dummyCars } from "@/views/cars/store/dummy";

export const useCarStore = defineStore("car", () => {
  const cars = ref<Car[]>(dummyCars);
  const searchQuery = ref("");
  const currentCar=ref(null)
  const statusFilter = ref("all");
  const currentPage = ref(0);
  const pageSize = ref(5);
  const isLoading = ref(false);
  const selectedCar:any= ref(null)
  const isEditing = ref(false);
  const formData = ref<CarFormData>({
    brand: "",
    model: "",
    year: 0,
    color: "",
    price: 0,
    mileage: 0,
    fuelType: "petrol",
    transmission: "manual",
    status: true,
  });
  const formErrors = ref<Record<string, string>>({});
  const pagination = ref<PaginationState>({
    page: 1,
    pageSize: 10,
    totalItems: 0,
  });

  const filteredCars = computed(() => {
    return cars.value.filter((car) => {
      const matchesSearch =
        car.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        car.color.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        car.fuelType.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        car.transmission
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        car.year.toString().includes(searchQuery.value.toString()) ||
        car.price.toString().includes(searchQuery.value.toString());
      const matchesStatus =
        statusFilter.value === "all" || car.status === statusFilter.value;

      return matchesSearch && matchesStatus;
    });
  });

  const totalPages = computed(() =>
    Math.ceil(filteredCars.value.length / pageSize.value)
  );
  const startIndex = computed(() => currentPage.value * pageSize.value);
  const endIndex = computed(() => startIndex.value + pageSize.value);
  const paginatedCars = computed(() =>
    filteredCars.value.slice(startIndex.value, endIndex.value)
  );

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
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.value.brand.trim()) {
      errors.brand = "Car Brand is Required";
    } else if (formData.value.brand.trim().length < 2) {
      errors.brand = "Car Brand must be at least 2 characters";
    }

    if (!formData.value.model.trim()) {
      errors.model = "Car Model is Required";
    } else if (formData.value.model.trim().length < 1) {
      errors.model = "Car Model must be at least 1 character";
    }

    const currentYear = new Date().getFullYear();
    if (!formData.value.year || isNaN(formData.value.year)) {
      errors.year = "Year is required";
    } else if (
      formData.value.year < 1886 ||
      formData.value.year > currentYear + 1
    ) {
      errors.year = `Year must be between 1886 and ${currentYear + 1}`;
    }

    if (!formData.value.color.trim()) {
      errors.color = "Color is required";
    }

    if (formData.value.price === undefined || formData.value.price === null) {
      errors.price = "Price is required";
    } else if (formData.value.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (
      formData.value.mileage === undefined ||
      formData.value.mileage === null
    ) {
      errors.mileage = "Mileage is required";
    } else if (formData.value.mileage < 0) {
      errors.mileage = "Mileage cannot be negative";
    }

    if (!formData.value.fuelType.trim()) {
      errors.fuelType = "Fuel type is required";
    }

    if (!formData.value.transmission.trim()) {
      errors.transmission = "Transmission is required";
    }
    if (typeof formData.value.status !== "boolean") {
      errors.status = "Status is required";
    }
    const duplicateModel = cars.value.find((car) => {
      car.model.toLowerCase() === formData.value.model.trim().toLowerCase() &&
        (!isEditing.value || car.id !== selectedCar.value?.id);
    });
    if (duplicateModel) {
      errors.model = "A car with this model already exists";
    }

    formErrors.value = errors;
    return Object.keys(errors).length === 0;
  };

  const openCreateDialog = () => {
    isEditing.value = false;
    selectedCar.value = null;
    formData.value = {
      brand: "",
      model: "",
      year: 0,
      color: "",
      price: 0,
      mileage: 0,
      fuelType: "petrol",
      transmission: "manual",
      status: true,
    };
    formErrors.value = {};
  };
  const openEditDialog = (car: Car) => {
    isEditing.value = true;
    selectedCar.value = car;
    formData.value = {
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

  const saveCar = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }
    isLoading.value = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const carData = {
        brand: formData.value.brand.trim(),
        model: formData.value.model.trim(),
        year: formData.value.year,
        color: formData.value.color.trim(),
        price: formData.value.price,
        mileage: formData.value.mileage,
        fuelType: formData.value.fuelType as
          | "electric"
          | "petrol"
          | "hybrid"
          | "diesel",
        transmission: formData.value.transmission as "automatic" | "manual",
        status: formData.value.status
          ? "available"
          : ("sold" as "available" | "sold"),
        updatedAt: new Date(),
      };
      if (isEditing.value && selectedCar.value) {
        const index = cars.value.findIndex(
          (c) => c.id === selectedCar.value!.id
        );
        if (index !== -1) {
          cars.value[index] = {
            ...cars.value[index],
            ...carData,
          };
        }
      } else {
        const newCar: Car = {
          id: Math.max(...cars.value.map((c) => c.id), 0) + 1,
          ...carData,
          createdAt: new Date(),
        };
        cars.value.push(newCar);
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      isLoading.value = true;
    }
  };


  const deleteCar = async (): Promise<boolean>=> {
    if ( !selectedCar.value) return false
    isLoading.value=true

    try{
        await new Promise(resolve => setTimeout(resolve,500))
        cars.value =cars.value.filter(car => car.id !== selectedCar.value!.id)
        selectedCar.value=null
        return true

    }catch(error){
        return false
    }finally{
        isLoading.value=true
    }
  }


  function setPagination(newPagination: Partial<PaginationState>) {
    pagination.value = { ...pagination.value, ...newPagination };
  }

  return {
    cars,
    searchQuery,
    selectedCar,
    statusFilter,
    currentPage,
    currentCar,
    pageSize,
    isLoading,
    isEditing,
    formData,
    formErrors,
    totalPages,
    startIndex,
    endIndex,
    paginatedCars,
    pagination,
    filteredCars,

    nextPage,
    prevPage,
    resetPage,
    setSelectedCar,
    openCreateDialog,
    openEditDialog,
    saveCar,
    deleteCar,
    setPagination,
  };
});

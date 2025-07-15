<template>
  <div class="container mx-auto py-5 px-5">
    <!-- Header with Stats -->
    <div class="grid gap-4 md:grid-cols-4 mb-6">
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Total Cars</p>
            <p class="text-2xl font-bold">{{ cars.length }}</p>
          </div>
          <Car class="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Available</p>
            <p class="text-2xl font-bold text-green-600">{{ availableCars }}</p>
          </div>
          <CheckCircle class="h-8 w-8 text-green-600" />
        </div>
      </Card>
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Sold</p>
            <p class="text-2xl font-bold text-red-600">{{ soldCars }}</p>
          </div>
          <XCircle class="h-8 w-8 text-red-600" />
        </div>
      </Card>
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">Total Value</p>
            <p class="text-2xl font-bold">${{ totalValue.toLocaleString() }}</p>
          </div>
          <DollarSign class="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>
    </div>

    <!-- Main Header -->
    <Card class="flex items-center justify-between mb-6 px-4 py-4">
      <div>
        <h1 class="text-3xl font-bold">Cars Management</h1>
        <p class="text-muted-foreground mt-1">
          Manage your organization's car inventory
        </p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="exportData" :disabled="isLoading">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button @click="openCreateDialog">
          <Plus class="h-4 w-4 mr-2" />
          Add Car
        </Button>
      </div>
    </Card>

    <!-- Filters and Search -->
    <Card class="mb-4 p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Search cars by brand, model, year, color..."
              class="pl-10"
            />
          </div>
        </div>
        <Select v-model="statusFilter">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
        <Select v-model="sortBy">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="brand">Brand</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" @click="clearFilters" v-if="hasActiveFilters">
          <X class="h-4 w-4 mr-2" />
          Clear
        </Button>
      </div>
    </Card>

    <!-- Table -->
    <Card>
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[80px]">Image</TableHead>
              <TableHead class="cursor-pointer" @click="toggleSort('brand')">
                Brand
                <ArrowUpDown class="ml-1 h-4 w-4 inline" />
              </TableHead>
              <TableHead class="cursor-pointer" @click="toggleSort('model')">
                Model
                <ArrowUpDown class="ml-1 h-4 w-4 inline" />
              </TableHead>
              <TableHead class="cursor-pointer" @click="toggleSort('year')">
                Year
                <ArrowUpDown class="ml-1 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Color</TableHead>
              <TableHead class="cursor-pointer" @click="toggleSort('price')">
                Price
                <ArrowUpDown class="ml-1 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Transmission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="cursor-pointer" @click="toggleSort('createdAt')">
                Created
                <ArrowUpDown class="ml-1 h-4 w-4 inline" />
              </TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="car in paginatedCars"
              :key="car.id"
              class="cursor-pointer hover:bg-muted/50"
              @click="openDetailsDialog(car)"
            >
              <TableCell>
                <div class="w-16 h-12 bg-muted rounded flex items-center justify-center">
                  <img
                    v-if="car.img"
                    :src="car.img"
                    alt="Car Image"
                    class="w-full h-full object-cover rounded"
                  />
                  <Car v-else class="h-6 w-6 text-muted-foreground" />
                </div>
              </TableCell>
              <TableCell class="font-medium">{{ car.brand }}</TableCell>
              <TableCell>{{ car.model }}</TableCell>
              <TableCell>{{ car.year }}</TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div 
                    class="w-4 h-4 rounded-full border"
                    :style="{ backgroundColor: getColorValue(car.color) }"
                  ></div>
                  {{ car.color }}
                </div>
              </TableCell>
              <TableCell class="font-medium">${{ car.price.toLocaleString() }}</TableCell>
              <TableCell>
                <Badge :variant="car.transmission === 'automatic' ? 'default' : 'secondary'">
                  {{ car.transmission }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="car.status === 'available' ? 'default' : 'destructive'">
                  {{ car.status === 'available' ? 'Available' : 'Sold' }}
                </Badge>
              </TableCell>
              <TableCell>{{ formatDate(car.createdAt) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    @click.stop="openDetailsDialog(car)"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    @click.stop="openEditDialog(car)"
                    title="Edit Car"
                  >
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-red-500"
                    @click.stop="openDeleteDialog(car)"
                    title="Delete Car"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-if="paginatedCars.length === 0">
              <TableCell colspan="10" class="text-center py-12">
                <div class="flex flex-col items-center gap-2">
                  <Car class="h-12 w-12 text-muted-foreground" />
                  <div class="text-lg font-medium">No cars found</div>
                  <p class="text-muted-foreground">
                    Try adjusting your filters or create a new car.
                  </p>
                  <Button @click="openCreateDialog" class="mt-2">
                    <Plus class="h-4 w-4 mr-2" />
                    Add First Car
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </Card>

    <!-- Pagination -->
    <Card class="flex items-center justify-between mt-4 px-4 py-3">
      <div class="text-sm text-muted-foreground">
        Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredCars.length) }} of {{ filteredCars.length }} cars
      </div>
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium">Rows per page</p>
          <Select :model-value="pageSize">
            <SelectTrigger class="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div class="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {{ currentPage + 1 }} of {{ totalPages }}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            :disabled="currentPage === 0"
            @click="prevPage"
          >
            <ChevronLeft class="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            :disabled="currentPage >= totalPages - 1"
            @click="nextPage"
          >
            <ChevronRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>

    <!-- Create/Edit Dialog -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {{ isEditing ? "Edit Car" : "Create New Car" }}
          </DialogTitle>
          <DialogDescription>
            {{ isEditing ? "Update the car details below." : "Add a new car to your inventory." }}
          </DialogDescription>
        </DialogHeader>
        
        <form @submit.prevent="saveCar" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Image Upload -->
            <div class="md:col-span-2">
              <Label for="img">Car Image</Label>
              <div class="mt-1">
                <input
                  id="img"
                  type="file"
                  accept="image/*"
                  @change="onImageChange"
                  class="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <div v-if="formData.img" class="mt-2">
                  <img
                    :src="formData.img"
                    alt="Car Preview"
                    class="w-32 h-24 object-cover rounded border"
                  />
                </div>
              </div>
            </div>

            <!-- Brand -->
            <div>
              <Label for="brand">Brand *</Label>
              <Input
                id="brand"
                v-model="formData.brand"
                placeholder="e.g., Toyota"
                :class="formErrors.brand ? 'border-destructive' : ''"
                required
              />
              <p v-if="formErrors.brand" class="text-sm text-destructive mt-1">
                {{ formErrors.brand }}
              </p>
            </div>

            <!-- Model -->
            <div>
              <Label for="model">Model *</Label>
              <Input
                id="model"
                v-model="formData.model"
                placeholder="e.g., Camry"
                :class="formErrors.model ? 'border-destructive' : ''"
                required
              />
              <p v-if="formErrors.model" class="text-sm text-destructive mt-1">
                {{ formErrors.model }}
              </p>
            </div>

            <!-- Year -->
            <div>
              <Label for="year">Year *</Label>
              <Input
                id="year"
                type="number"
                v-model.number="formData.year"
                placeholder="e.g., 2023"
                :min="1886"
                :max="new Date().getFullYear() + 1"
                :class="formErrors.year ? 'border-destructive' : ''"
                required
              />
              <p v-if="formErrors.year" class="text-sm text-destructive mt-1">
                {{ formErrors.year }}
              </p>
            </div>

            <!-- Color -->
            <div>
              <Label for="color">Color *</Label>
              <Input
                id="color"
                v-model="formData.color"
                placeholder="e.g., Silver"
                :class="formErrors.color ? 'border-destructive' : ''"
                required
              />
              <p v-if="formErrors.color" class="text-sm text-destructive mt-1">
                {{ formErrors.color }}
              </p>
            </div>

            <!-- Price -->
            <div>
              <Label for="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                v-model.number="formData.price"
                placeholder="e.g., 25000"
                min="1"
                step="100"
                :class="formErrors.price ? 'border-destructive' : ''"
                required
              />
              <p v-if="formErrors.price" class="text-sm text-destructive mt-1">
                {{ formErrors.price }}
              </p>
            </div>

            <!-- Mileage -->
            <div>
              <Label for="mileage">Mileage (miles) *</Label>
              <Input
                id="mileage"
                type="number"
                v-model.number="formData.mileage"
                placeholder="e.g., 15000"
                min="0"
                :class="formErrors.mileage ? 'border-destructive' : ''"
                required
              />
              <p v-if="formErrors.mileage" class="text-sm text-destructive mt-1">
                {{ formErrors.mileage }}
              </p>
            </div>

            <!-- Fuel Type -->
            <div>
              <Label for="fuelType">Fuel Type *</Label>
              <Select v-model="formData.fuelType">
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Transmission -->
            <div>
              <Label for="transmission">Transmission *</Label>
              <Select v-model="formData.transmission">
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Status -->
            <div class="md:col-span-2">
              <div class="flex items-center space-x-2">
                <Switch id="status" v-model:checked="formData.status" />
                <Label for="status">
                  {{ formData.status ? 'Available for sale' : 'Sold' }}
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter class="gap-2">
            <Button type="button" variant="outline" @click="showDialog = false">
              Cancel
            </Button>
            <Button type="submit" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isEditing ? "Update Car" : "Create Car" }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog v-model:open="showDeleteDialog">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Car</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>"{{ selectedCar?.brand }} {{ selectedCar?.model }}"</strong>?
            This action cannot be undone and will permanently remove the car from your inventory.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel :disabled="isLoading">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="deleteCar" :disabled="isLoading" class="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Delete Car
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Details Dialog -->
    <Dialog v-model:open="showDetailsDialog">
      <DialogContent class="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Car Details</DialogTitle>
          <DialogDescription>
            Complete information for {{ currentCar?.brand }} {{ currentCar?.model }}
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="currentCar" class="space-y-6">
          <!-- Image -->
          <div class="flex justify-center">
            <div class="w-64 h-48 bg-muted rounded-lg flex items-center justify-center">
              <img
                v-if="currentCar.img"
                :src="currentCar.img"
                alt="Car Image"
                class="w-full h-full object-cover rounded-lg"
              />
              <Car v-else class="h-16 w-16 text-muted-foreground" />
            </div>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-3">
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Brand</Label>
                <p class="text-lg font-semibold">{{ currentCar.brand }}</p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Model</Label>
                <p class="text-lg font-semibold">{{ currentCar.model }}</p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Year</Label>
                <p class="text-lg font-semibold">{{ currentCar.year }}</p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Color</Label>
                <div class="flex items-center gap-2">
                  <div 
                    class="w-4 h-4 rounded-full border"
                    :style="{ backgroundColor: getColorValue(currentCar.color) }"
                  ></div>
                  <p class="text-lg font-semibold">{{ currentCar.color }}</p>
                </div>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge :variant="currentCar.status === 'available' ? 'default' : 'destructive'" class="mt-1">
                  {{ currentCar.status === 'available' ? 'Available' : 'Sold' }}
                </Badge>
              </div>
            </div>
            
            <div class="space-y-3">
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Price</Label>
                <p class="text-lg font-semibold">${{ currentCar.price.toLocaleString() }}</p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Mileage</Label>
                <p class="text-lg font-semibold">{{ currentCar.mileage.toLocaleString() }} miles</p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Fuel Type</Label>
                <p class="text-lg font-semibold capitalize">{{ currentCar.fuelType }}</p>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Transmission</Label>
                <Badge :variant="currentCar.transmission === 'automatic' ? 'default' : 'secondary'" class="mt-1">
                  {{ currentCar.transmission }}
                </Badge>
              </div>
              <div>
                <Label class="text-sm font-medium text-muted-foreground">Created</Label>
                <p class="text-lg font-semibold">{{ formatDate(currentCar.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="closeDetailsDialog">Close</Button>
          <Button @click="openEditDialog(currentCar!)">
            <Pencil class="h-4 w-4 mr-2" />
            Edit Car
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Toast Container -->
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useToast } from "@/components/ui/toast";
import { useCarStore } from "@/views/cars/store";
import { storeToRefs } from "pinia";

// UI Components
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Toaster from "@/components/ui/toast/Toaster.vue";

// Icons
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Search,
  Download,
  X,
  ArrowUpDown,
  Car,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-vue-next";

// Store and composables
const carStore = useCarStore();
const { toast } = useToast();

// Store state
const {
  cars,
  filteredCars,
  currentCar,
  searchQuery,
  statusFilter,
  sortBy,
  sortOrder,
  currentPage,
  pageSize,
  totalPages,
  startIndex,
  endIndex,
  paginatedCars,
  isLoading,
  formData,
  formErrors,
  isEditing,
  selectedCar,
} = storeToRefs(carStore);

// Local reactive state
const showDialog = ref(false);
const showDeleteDialog = ref(false);
const showDetailsDialog = ref(false);

// Computed properties for dashboard stats
const availableCars = computed(() => 
  cars.value.filter(car => car.status === 'available').length
);

const soldCars = computed(() => 
  cars.value.filter(car => car.status === 'sold').length
);

const totalValue = computed(() => 
  cars.value.reduce((sum, car) => sum + car.price, 0)
);

const hasActiveFilters = computed(() => 
  searchQuery.value !== '' || statusFilter.value !== 'all' || sortBy.value !== 'createdAt'
);

// Watchers
watch([searchQuery, statusFilter, sortBy, sortOrder], () => {
  carStore.resetPage();
});

watch(pageSize, () => {
  carStore.resetPage();
});

// Utility functions
const formatDate = (date: Date | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getColorValue = (colorName: string) => {
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    purple: '#a855f7',
    pink: '#ec4899',
    orange: '#f97316',
    gray: '#6b7280',
    grey: '#6b7280',
    black: '#000000',
    white: '#ffffff',
    silver: '#c0c0c0',
    gold: '#ffd700',
  };
  return colorMap[colorName.toLowerCase()] || '#6b7280';
};

// Event handlers
const clearFilters = () => {
  searchQuery.value = '';
  statusFilter.value = 'all';
  sortBy.value = 'createdAt';
  carStore.resetPage();
};

const toggleSort = (field: string) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
};

const exportData = () => {
  try {
    const dataToExport = filteredCars.value.map(car => ({
      Brand: car.brand,
      Model: car.model,
      Year: car.year,
      Color: car.color,
      Price: car.price,
      Mileage: car.mileage,
      'Fuel Type': car.fuelType,
      Transmission: car.transmission,
      Status: car.status,
      Created: formatDate(car.createdAt)
    }));

    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cars-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Cars data has been exported to CSV file.",
    });
  } catch (error) {
    toast({
      title: "Export Failed",
      description: "Failed to export data. Please try again.",
      variant: "destructive",
    });
  }
};

// Pagination handlers
const nextPage = () => carStore.nextPage();
const prevPage = () => carStore.prevPage();

// Dialog handlers
const openCreateDialog = () => {
  carStore.openCreateDialog();
  showDialog.value = true;
};

const openEditDialog = (car: any) => {
  carStore.openEditDialog(car);
  showDialog.value = true;
  showDetailsDialog.value = false;
};

const openDeleteDialog = (car: any) => {
  carStore.setSelectedCar(car);
  showDeleteDialog.value = true;
};

const openDetailsDialog = (car: any) => {
  currentCar.value = { ...car };
  showDetailsDialog.value = true;
};

const closeDetailsDialog = () => {
  showDetailsDialog.value = false;
  currentCar.value = null;
};

// Image upload handler
const onImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.img = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// CRUD operations
const saveCar = async () => {
  const success = await carStore.saveCar();
  if (success) {
    showDialog.value = false;
    toast({
      title: "Success",
      description: isEditing.value ? "Car updated successfully." : "Car created successfully.",
    });
  } else {
    toast({
      title: "Error",
      description: "Please fix the errors and try again.",
      variant: "destructive",
    });
  }
};

const deleteCar = async () => {
  const success = await carStore.deleteCar();
  if (success) {
    showDeleteDialog.value = false;
    toast({
      title: "Success",
      description: "Car deleted successfully.",
    });
  } else {
    toast({
      title: "Error",
      description: "Failed to delete car. Please try again.",
      variant: "destructive",
    });
  }
  isLoading.value= false;
};
</script>
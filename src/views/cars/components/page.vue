<template>
  <div class="container mx-auto py-5 px-5">
    <Card class="flex items-center justify-between mb-8 px-3 py-4 md:my-3">
      <div>
        <h1 class="text-4xl font-bold">Cars Management</h1>
        <p class="text-muted-foreground mt-2">
          Manage your organization's Cars
        </p>
      </div>
      <Button @click="openCreateDialog">
        <Plus class="h-4 w-4 mr-2" />
        {{ "Add Car" }}
      </Button>
    </Card>

    <Card class="flex flex-col md:flex-row gap-4 mb-4 px-3 py-4">
      <div class="flex-1">
        <Input
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search on Cars by brand, model, year..."
          class="max-w-fit my-2 px-3"
        />
      </div>
      <Select v-model="statusFilter" @update:model-value="handleStatusFilter">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
        </SelectContent>
      </Select>
    </Card>

    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Transmission</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="car in paginatedCars"
            @click="openDetailsDialog(car)"
            :key="car.id"
          >
            <TableCell>{{ car.brand }}</TableCell>
            <TableCell>{{ car.model }}</TableCell>
            <TableCell>{{ car.year }}</TableCell>
            <TableCell>{{ car.color }}</TableCell>
            <TableCell class="capitalize">
              <Badge
                :variant="car.status === 'available' ? 'default' : 'secondary'"
              >
                {{ car.status }}
              </Badge>
            </TableCell>
            <TableCell class="capitalize">
              <Badge
                :variant="
                  car.transmission === 'automatic' ? 'default' : 'secondary'
                "
              >
                {{ car.transmission }}
              </Badge>
            </TableCell>
            <TableCell>{{ formatDate(car.createdAt) }}</TableCell>
            <TableCell class="text-right">
              <div class="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  @click.stop="openDetailsDialog(car)"
                >
                  <Eye class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click.stop="openEditDialog(car)"
                >
                  <Pencil class="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  @click.stop="openDeleteDialog(car)"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="paginatedCars.length === 0">
            <TableCell colspan="6" class="text-center py-8">
              <div class="text-center text-muted-foreground">
                No cars found. Try adjusting your filters or create a new car.
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <!-- pagination -->
    <Card class="flex items-center justify-between mt-4 px-3 py-4">
      <div class="text-sm text-muted-foreground">
        Showing {{ startIndex + 1 }} to
        {{ Math.min(endIndex, filteredCars.length) }} of
        {{ filteredCars.length }} cars
      </div>
      <div class="flex items-center space-x-6 lg:space-x-8">
        <div class="flex items-center space-x-2">
          <p class="text-sm font-medium">Rows per Page</p>
          <Select v-model="pageSize" @update:model-value="handlePageSizeChange">
            <SelectTrigger class="h-7 w-7">
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
        <div
          class="flex w-[100px] items-center justify-center text-sm font-medium"
        >
          Page {{ currentPage + 1 }} of {{ totalPages }}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            :disabled="currentPage === 0"
            @click="prevPage"
          >
            <ChevronLeft class="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            :disabled="currentPage >= totalPages - 1"
            @click="nextPage"
          >
            <ChevronRight class="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>

    <!-- create/edit dialog -->

    <Dialog v-model:open="showDialog">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {{ isEditing ? "Edit Car" : "Create New Car" }}</DialogTitle
          >
          <DialogDescription>
            {{
              isEditing
                ? "Update the car details below."
                : "Add a new car to your organization."
            }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="brand">Car Brand</Label>
            <Input
              id="brand"
              v-model="formData.brand"
              placeholder="Enter Car Brand"
              :class="formErrors.brand ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.brand" class="text-sm text-red-500">
              {{ formErrors.brand }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="brand">Car Model</Label>
            <Input
              id="model"
              v-model="formData.model"
              placeholder="Enter Car Model"
              :class="formErrors.model ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.model" class="text-sm text-red-500">
              {{ formErrors.model }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="year">Car Year</Label>
            <Input
              id="year"
              type="number"
              min="1"
              v-model="formData.year"
              placeholder="Enter Car Year"
              :class="formErrors.year ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.year" class="text-sm text-red-500">
              {{ formErrors.year }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="brand">Car Color</Label>
            <Input
              id="color"
              v-model="formData.color"
              placeholder="Enter Car Color"
              :class="formErrors.color ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.color" class="text-sm text-red-500">
              {{ formErrors.color }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="brand">Car Price</Label>
            <Input
              id="price"
              type="number"
              min="1"
              v-model="formData.price"
              placeholder="Enter Car Price"
              :class="formErrors.price ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.price" class="text-sm text-red-500">
              {{ formErrors.price }}
            </p>
          </div>
          <div class="grid gap-2">
            <Label for="brand">Car Mileage</Label>
            <Input
              id="mileage"
              type="number"
              min="1"
              v-model="formData.mileage"
              placeholder="Enter Car Mileage"
              :class="formErrors.mileage ? 'border-red-500' : ''"
            />
            <p v-if="formErrors.mileage" class="text-sm text-red-500">
              {{ formErrors.mileage }}
            </p>
          </div>
          <div class="grid gap-2">
          <Label for="fuelType">Fuel Type</Label>
          <Select class="w-full" v-model="formData.fuelType" >
            <SelectTrigger>
            <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              </SelectContent>
          </Select>
          </div>


                            
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useToast } from "@/components/ui/toast";
import { useCarStore } from "@/views/cars/store";
import { storeToRefs } from "pinia";

import { Card } from "@/components/ui/card";
// Import shadcn-vue components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Toaster from "@/components/ui/toast/Toaster.vue";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Import icons from lucide-vue-next
// Icons
import {
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
} from "lucide-vue-next";

const carStore = useCarStore();

const { toast } = useToast();

const {
  cars,
  filteredCars,
  currentCar,
  searchQuery,
  statusFilter,
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

const showDialog = ref(false);
const showDeleteDialog = ref(false);

watch([searchQuery, statusFilter], () => {
  carStore.resetPage();
});

const formatDate = (date: Date | undefined) => {
  return date ? new Date(date).toLocaleDateString() : "";
};

const handleSearch = () => carStore.resetPage();
const handleStatusFilter = () => carStore.resetPage();
const handlePageSizeChange = () => carStore.resetPage();
const nextPage = () => carStore.nextPage();
const prevPage = () => carStore.prevPage();

const openCreateDialog = () => {
  carStore.openCreateDialog();
  showDialog.value = true;
};

const openEditDialog = (car: any) => {
  carStore.openEditDialog(car);
  showDialog.value = true;
};

const openDeleteDialog = (car: any) => {
  carStore.setSelectedCar(car);
  showDeleteDialog.value = true;
};

const openDetailsDialog = (car: any) => {
  currentCar.value = { ...car };
};

const saveBranch = async () => {
  const success = await carStore.saveCar();
  if (success) {
    showDialog.value = false;
    toast({
      title: "Success",
      description: isEditing.value ? "Car Updated." : "Car Created",
    });
  } else {
    toast({
      title: "Error",
      description: "Pleasr fix the errors bellow and try again.",
    });
  }
};

const deleteCar = async () => {
  const carName = selectedCar.value?.brand;
  const success = await carStore.deleteCar();
  if (success) {
    showDeleteDialog.value = false;
    toast({
      title: "Success",
      description: "Car Deleted successfully.",
    });
  } else {
    toast({
      title: "Error",
      description: "Failed to delete Car. Please Try again.",
      variant: "destructive",
    });
  }
};
</script>

<style scoped></style>

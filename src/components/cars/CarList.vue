<script setup lang="ts">
import { useCarStore } from "@/stores/carStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { ref } from "vue";
import { CarForm } from "@/components/cars/CarForm.vue";
import type { Car } from "@/types/car";

const store = useCarStore();
const isAddingCar = ref(false);
const selectedCar = ref<Car | undefined>();

const fuelTypes = ["petrol", "diesel", "electric", "hybrid"];
const transmissions = ["manual", "automatic"];
const statuses = ["available", "sold", "maintenance"];

const handleSearch = (value: string) => {
  store.setFilters({ search: value });
};

const handleFilterChange = (
  key: string,
  value: string | number | [number, number]
) => {
  store.setFilters({ [key]: value });
};

const handlePageChange = (page: number) => {
  store.setPagination({ page });
};

const handlePageSizeChange = (pageSize: number) => {
  store.setPagination({ pageSize, page: 1 });
};

defineOptions({
  name: "CarList",
});
</script>

<template>
  <div class="container mx-auto p-4">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <CardTitle>Cars Management</CardTitle>
        <Button @click="isAddingCar = true">Add New Car</Button>
      </CardHeader>
      <CardContent>
        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            v-model="store.filters.search"
            placeholder="Search by brand or model..."
            @input="handleSearch($event.target.value)"
          />

          <Select
            v-model="store.filters.brand"
            @update:modelValue="handleFilterChange('brand', $event)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Brands</SelectItem>
              <SelectItem
                v-for="brand in [
                  ...new Set(store.cars.map((car) => car.brand)),
                ]"
                :key="brand"
                :value="brand"
              >
                {{ brand }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            v-model="store.filters.fuelType"
            @update:modelValue="handleFilterChange('fuelType', $event)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem v-for="type in fuelTypes" :key="type" :value="type">
                {{ type }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            v-model="store.filters.transmission"
            @update:modelValue="handleFilterChange('transmission', $event)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Transmissions</SelectItem>
              <SelectItem
                v-for="trans in transmissions"
                :key="trans"
                :value="trans"
              >
                {{ trans }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            v-model="store.filters.status"
            @update:modelValue="handleFilterChange('status', $event)"
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem
                v-for="status in statuses"
                :key="status"
                :value="status"
              >
                {{ status }}
              </SelectItem>
            </SelectContent>
          </Select>

          <div class="space-y-2">
            <label class="text-sm font-medium">Price Range</label>
            <Slider
              v-model="store.filters.priceRange"
              :min="0"
              :max="100000"
              :step="1000"
              @update:modelValue="handleFilterChange('priceRange', $event)"
            />
            <div class="flex justify-between text-sm text-gray-500">
              <span>${{ store.filters.priceRange[0] }}</span>
              <span>${{ store.filters.priceRange[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Car Table -->
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Transmission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="car in store.filteredCars" :key="car.id">
              <TableCell>{{ car.brand }}</TableCell>
              <TableCell>{{ car.model }}</TableCell>
              <TableCell>{{ car.year }}</TableCell>
              <TableCell>${{ car.price.toLocaleString() }}</TableCell>
              <TableCell>{{ car.fuelType }}</TableCell>
              <TableCell>{{ car.transmission }}</TableCell>
              <TableCell>{{ car.status }}</TableCell>
              <TableCell>
                <div class="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="store.updateCar(car.id, { status: 'sold' })"
                  >
                    Mark Sold
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    @click="store.deleteCar(car.id)"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Rows per page:</span>
            <Select
              v-model="store.pagination.pageSize"
              @update:modelValue="handlePageSizeChange($event)"
            >
              <SelectTrigger class="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="5">5</SelectItem>
                <SelectItem :value="10">10</SelectItem>
                <SelectItem :value="20">20</SelectItem>
                <SelectItem :value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex items-center space-x-2">
            <Button
              variant="outline"
              :disabled="store.pagination.page === 1"
              @click="handlePageChange(store.pagination.page - 1)"
            >
              Previous
            </Button>
            <span class="text-sm">
              Page {{ store.pagination.page }} of
              {{
                Math.ceil(
                  store.pagination.totalItems / store.pagination.pageSize
                )
              }}
            </span>
            <Button
              variant="outline"
              :disabled="
                store.pagination.page >=
                Math.ceil(
                  store.pagination.totalItems / store.pagination.pageSize
                )
              "
              @click="handlePageChange(store.pagination.page + 1)"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <CarForm
      :is-open="isAddingCar"
      :car="selectedCar"
      @close="
        isAddingCar = false;
        selectedCar = undefined;
      "
    />
  </div>
</template>

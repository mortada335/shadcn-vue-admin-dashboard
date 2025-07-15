# Project Name

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Cars Inventory</h1>

    <!-- Filters Section -->
    <div class="mb-6 space-y-4">
      <Input
        v-model="store.filters.search"
        type="text"
        placeholder="Search by brand or model..."
        class="w-full"
        @input="handleSearchInput"
      />

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select
          v-model="store.filters.brand"
          @update:model-value="handleBrandChange"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Brands</SelectItem>
            <SelectItem
              v-for="brand in uniqueBrands"
              :key="brand"
              :value="brand"
            >
              {{ brand }}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          v-model="store.filters.fuelType"
          @update:model-value="handleFuelTypeChange"
        >
          <SelectTrigger>
            <SelectValue placeholder="Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Fuel Types</SelectItem>
            <SelectItem value="Petrol">Petrol</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Electric">Electric</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>

        <Select
          v-model="store.filters.transmission"
          @update:model-value="handleTransmissionChange"
        >
          <SelectTrigger>
            <SelectValue placeholder="Transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Transmissions</SelectItem>
            <SelectItem value="Automatic">Automatic</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select
          v-model="store.filters.status"
          @update:model-value="handleStatusChange"
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Sold">Sold</SelectItem>
            <SelectItem value="Reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <!-- Cars Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="car in store.filteredCars"
        :key="car.id"
        class="overflow-hidden"
      >
        <CardHeader>
          <CardTitle>{{ car.brand }} {{ car.model }}</CardTitle>
          <CardDescription>Year: {{ car.year }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <p class="text-sm text-muted-foreground">
              Price: ${{ car.price.toLocaleString() }}
            </p>
            <p class="text-sm text-muted-foreground">
              Fuel: {{ car.fuelType }}
            </p>
            <p class="text-sm text-muted-foreground">
              Transmission: {{ car.transmission }}
            </p>
            <Badge :variant="getStatusVariant(car.status)">{{
              car.status
            }}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-between items-center">
      <p class="text-sm text-muted-foreground">
        Showing
        {{ (store.pagination.page - 1) * store.pagination.pageSize + 1 }} to
        {{
          Math.min(
            store.pagination.page * store.pagination.pageSize,
            store.pagination.totalItems
          )
        }}
        of {{ store.pagination.totalItems }} cars
      </p>
      <div class="space-x-2">
        <Button
          variant="outline"
          :disabled="store.pagination.page === 1"
          @click="store.setPagination({ page: store.pagination.page - 1 })"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          :disabled="
            store.pagination.page * store.pagination.pageSize >=
            store.pagination.totalItems
          "
          @click="store.setPagination({ page: store.pagination.page + 1 })"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCarStore } from "@/views/cars/store/index";
import { computed } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const store = useCarStore();

// Get unique brands for the filter dropdown
const uniqueBrands = computed(() => {
  const brands = new Set(store.cars.map((car) => car.brand));
  return Array.from(brands).sort();
});

// Event handlers
const handleSearchInput = (e: Event) => {
  store.setFilters({ search: (e.target as HTMLInputElement).value });
};

const handleBrandChange = (value: string) => {
  store.setFilters({ brand: value });
};

const handleFuelTypeChange = (value: string) => {
  store.setFilters({ fuelType: value });
};

const handleTransmissionChange = (value: string) => {
  store.setFilters({ transmission: value });
};

const handleStatusChange = (value: string) => {
  store.setFilters({ status: value });
};

// Helper function for badge variants
const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return "secondary";
    case "sold":
      return "destructive";
    case "reserved":
      return "outline";
    default:
      return "default";
  }
};
</script>

<style scoped>
.disabled {
  cursor: not-allowed;
}
</style>
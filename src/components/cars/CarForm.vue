<script setup lang="ts">
import { ref } from "vue";
import { useCarStore } from "@/stores/carStore";
import type { Car } from "@/types/car";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "vee-validate";
import * as z from "zod";
import { toTypedSchema } from "@vee-validate/zod";

const props = defineProps<{
  car?: Car;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const store = useCarStore();

const formSchema = toTypedSchema(
  z.object({
    brand: z.string().min(1, "Brand is required"),
    model: z.string().min(1, "Model is required"),
    year: z
      .number()
      .min(1900)
      .max(new Date().getFullYear() + 1),
    color: z.string().min(1, "Color is required"),
    price: z.number().min(0),
    mileage: z.number().min(0),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]),
    transmission: z.enum(["manual", "automatic"]),
    status: z.enum(["available", "sold", "maintenance"]),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: props.car || {
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    price: 0,
    mileage: 0,
    fuelType: "petrol",
    transmission: "automatic",
    status: "available",
  },
});

const onSubmit = form.handleSubmit((values) => {
  if (props.car) {
    store.updateCar(props.car.id, values);
  } else {
    store.addCar(values);
  }
  emit("close");
});

defineOptions({
  name: "CarForm",
});
</script>

<template>
  <Dialog :open="isOpen" @update:open="emit('close')">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ props.car ? "Edit Car" : "Add New Car" }}</DialogTitle>
      </DialogHeader>
      <Form @submit="onSubmit">
        <div class="grid gap-4 py-4">
          <FormField v-slot="{ field }" name="brand">
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="model">
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="year">
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input type="number" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="color">
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="price">
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="mileage">
            <FormItem>
              <FormLabel>Mileage</FormLabel>
              <FormControl>
                <Input type="number" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="fuelType">
            <FormItem>
              <FormLabel>Fuel Type</FormLabel>
              <Select v-bind="field">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="transmission">
            <FormItem>
              <FormLabel>Transmission</FormLabel>
              <Select v-bind="field">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ field }" name="status">
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select v-bind="field">
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex justify-end space-x-2">
          <Button type="button" variant="outline" @click="emit('close')"
            >Cancel</Button
          >
          <Button type="submit">{{ props.car ? "Update" : "Add" }} Car</Button>
        </div>
      </Form>
    </DialogContent>
  </Dialog>
</template>

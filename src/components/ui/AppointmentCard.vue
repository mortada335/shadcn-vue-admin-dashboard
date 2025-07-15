<!-- src/components/ui/AppointmentCard.vue -->
<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="font-medium">{{ appointment.patientName }}</h3>
        <p class="text-sm text-muted-foreground">
          {{ appointment.date }} at {{ appointment.time }}
        </p>
      </div>
      <div class="px-2 py-1 rounded text-xs font-medium" :class="statusClass">
        {{ appointment.status }}
      </div>
    </div>
    <div class="mt-2">
      <p class="text-sm">
        <span class="font-medium">Doctor:</span> {{ appointment.doctorName }}
      </p>
      <p class="text-sm">
        <span class="font-medium">Department:</span>
        {{ appointment.department }}
      </p>
      <p class="text-sm">
        <span class="font-medium">Reason:</span> {{ appointment.reason }}
      </p>
    </div>
    <div class="mt-3 flex justify-end space-x-2">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
});

const statusClass = computed(() => {
  switch (props.appointment.status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
});
</script>

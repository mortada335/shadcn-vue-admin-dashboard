<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
const props = defineProps<{
  permission: string;
}>();

const authStore = useAuthStore();
const isUserAuthorized = computed(() => {
  return true;
  // const permissions = authStore.permissions.value;
  // return permissions != undefined && permissions.some((p) => p == props.permission)
});
</script>
<template>
  <template v-if="isUserAuthorized">
    <slot />
  </template>
</template>

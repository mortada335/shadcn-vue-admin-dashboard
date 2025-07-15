<script setup lang="ts">
import { useSidebar } from '@/components/ui/sidebar';
import UserProfile from '../navbar/UserProfile.vue';
const { open, isMobile } = useSidebar();
const isOpen = computed(() => open.value || isMobile.value)
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

</script>
<template>
  <div class="h-[50px] flex gap-3 items-center">
    <UserProfile />
    <div v-if="isOpen" class="flex-grow flex flex-col text-sm p-2">
      <span>{{ authStore.user.value?.name }}</span>
      <span class="text-primary/70 text-xs">{{ authStore.user.value?.email }}</span>
    </div>
  </div>
</template>

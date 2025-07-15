<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const props = defineProps<{
  permission: string
}>()

const authStore = useAuthStore();
const router = useRouter();
const permission = computed(() => props.permission)

const isUserAuthorized = computed(() => {
  // if (!permission.value) return false;
  // // const permissions = authStore.permissions.value;
  // // if (permissions == undefined) return false;
  // // if (permissions.some((p) => p == permission.value)) return true;
  // else
  //   router.push('/login')
  return true;
})
</script>
<template>
  <template v-if="isUserAuthorized">
    <slot />
  </template>
</template>

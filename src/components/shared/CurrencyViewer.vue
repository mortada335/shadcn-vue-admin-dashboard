<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  value: string
}>()

const auth = useAuthStore();


const amount = computed(() => {
  return (parseFloat(props.value) / auth.activeCurrency.exchangeRate).toFixed(2);
})

const code = computed(() => {
  return auth.activeCurrency.code;
})

</script>
<template>
  <span>{{ amount }} <span class="font-bold">{{ code }}</span></span>
</template>

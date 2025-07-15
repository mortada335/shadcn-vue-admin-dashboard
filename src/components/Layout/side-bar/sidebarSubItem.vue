<script setup lang="ts">
import { NavigationChildItem, } from '@/navigation/types';
import { SidebarMenuSubItem, SidebarMenuSubButton } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/auth';
const props = defineProps<{
  item: NavigationChildItem
}>()
const { can: _can } = useAuthStore();
const can = computed(() => {
  if (!props.item.permission) return true;
  return _can(props.item.permission)
})
</script>
<template>
  <RouterLink v-if="can" :to="item.to"
    class="w-full transition-colors duration-500 mx-2 hover:bg-secondary hover:text-primary text-secondary-foreground/50"
    activeClass="!text-primary !border-primary">
    <SidebarMenuSubItem class="w-full flex border-inherit">
      <SidebarMenuSubButton as="child" class="rounded-none border-s border-inherit">
        <icon :icon="item.icon" />
        {{ $t(item.title) }}
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  </RouterLink>
</template>

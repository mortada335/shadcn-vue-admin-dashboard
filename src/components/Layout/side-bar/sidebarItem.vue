<script setup lang="ts">
import { NavigationItem } from '@/navigation/types';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub } from '@/components/ui/sidebar';
import { Icon } from '@iconify/vue/dist/iconify.js';
import SidebarSubItem from './sidebarSubItem.vue';
import { useAuthStore } from '@/stores/auth';
const props = defineProps<{
  item: NavigationItem
}>()
const open = ref(true);
const hasChildren = computed(() => props.item.children && props.item.children.length)
const { can: _can } = useAuthStore();
const can = computed(() => {
  const canChildren = props.item.children ? props.item.children.some(c => !c.permission || _can(c.permission)) : true;
  return canChildren;
})
const to = computed(() => {
  if (props.item.to) return props.item.to;
  if (props.item.children && props.item.children.length > 0) {
    const to = (props.item.children[0].to as string).split('/');
    to.pop();
    return to.join('/')
  }
  return '/'
})
</script>
<template>
  <SidebarMenuItem v-if="can" class="w-full flex flex-col gap-1 justify-start">
    <RouterLink :to class="transition-colors duration-500 rounded mx-2 hover:bg-secondary hover:text-primary"
      activeClass="!bg-secondary-foreground !text-secondary">
      <SidebarMenuButton as="child">
        <Icon :icon="item.icon" />
        {{ $t(item.title) }}
        <div class="flex-grow" />
        <Icon v-if="hasChildren && false" icon="tabler-chevron-down" @click.prevent="open = !open" />
      </SidebarMenuButton>
    </RouterLink>
    <SidebarMenuSub v-if="hasChildren && open" class="items-start border-0 gap-1">
      <SidebarSubItem v-for="child in item.children" :item="child" />
    </SidebarMenuSub>
  </SidebarMenuItem>
</template>

<script setup lang="ts">
import { NavigationHeader } from '@/navigation/types';
import { SidebarGroupLabel, SidebarGroup, useSidebar } from '@/components/ui/sidebar';
import { Icon } from '@iconify/vue/dist/iconify.js';
const { open } = useSidebar();

defineProps<{
  item: NavigationHeader
}>()
</script>
<template>
  <SidebarGroup v-if="open">
    <SidebarGroupLabel class="flex gap-3 text-lg">
      <Icon v-if="item.icon" :icon="item.icon" />
      {{ item.title }}
    </SidebarGroupLabel>
  </SidebarGroup>
</template>

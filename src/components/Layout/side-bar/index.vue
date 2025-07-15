<script setup lang="ts">
import navigation from "@/navigation";
import {
  Sidebar,
  SidebarMenu,
  SidebarContent,
  SidebarHeader,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import SidebarTrigger from "@/components/ui/sidebar/SidebarTrigger.vue";
import { NavigationHeader, NavigationItem } from "@/navigation/types";
import AppSidebarHeader from "./sidebarHeader.vue";
import AppSidebarItem from "./sidebarItem.vue";
import SidebarUserProfile from "./sidebarUserProfile.vue";

const { open, isMobile } = useSidebar();
const isOpen = computed(() => open.value || isMobile.value);

const resolveItemComponent = (item: NavigationItem & NavigationHeader) => {
  if (item.header) return AppSidebarHeader;
  return AppSidebarItem;
};
</script>
<template>
  <Sidebar
    variant="sidebar"
    collapsible="icon"
    class="flex justify-center form-scrollbar"
  >
    <SidebarHeader
      class="h-[60px] mb-2 border-b flex flex-row items-center justify-center"
    >
      <template v-if="isOpen">
        <icon icon="tabler-building-warehouse" class="h-[30px]" />
        <div class="flex-grow" />
      </template>
      <SidebarTrigger />
    </SidebarHeader>
    <SidebarContent class="form-scrollbar">
      <SidebarMenu>
        <template v-for="item in navigation">
          <component
            :is="resolveItemComponent(item as NavigationItem & NavigationHeader)"
            :item="item as any"
          />
        </template>
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter>
      <SidebarUserProfile />
    </SidebarFooter>
  </Sidebar>
</template>

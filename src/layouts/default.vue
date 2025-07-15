<script setup lang="ts">
import Sidebar from "@/components/Layout/side-bar/index.vue";
import AppDelete from "@/components/app-crud/AppDelete.vue";
import Navbar from "@/components/Layout/navbar/index.vue";
import SidebarProvider from "@/components/ui/sidebar/SidebarProvider.vue";
import { RouterView } from "vue-router";
import AppBreadCrumbs from "@/components/Layout/navbar/BreadCrumb.vue";
import $api from "@/api/api";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>
<template>
  <SidebarProvider>
    <Sidebar />
    <div class="w-full">
      <Navbar />
      <div class="p-2 mx-auto max-w-[80vw] flex-grow flex flex-col">
        <AppBreadCrumbs />
        <div
          class="overflow-y-scroll max-h-[80vh] container"
          style="scrollbar-width: none"
        >
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.name" />
          </RouterView>
        </div>
      </div>
    </div>
  </SidebarProvider>
  <AppDelete />
</template>

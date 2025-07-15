<template>
  <div class="w-full rounded border-b  mb-2 p-3 py-1.5 flex items-center gap-3 h-[60px]">
    <SidebarTrigger v-if="isMobile" />
    <div class="flex-grow" />
      <Usertheme />
      <UserLanguage />
      <UserProfile />
  </div>
</template>
<script setup lang="ts">
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
const { isMobile } = useSidebar();
import UserLanguage from './UserLanguage.vue';
import UserProfile from './UserProfile.vue';
import Usertheme from './Usertheme.vue';
</script>

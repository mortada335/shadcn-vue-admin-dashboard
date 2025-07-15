<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue/dist/iconify.js';
import { useAuthStore } from '@/stores/auth';
import Can from '@/components/auth/Can.vue';
import CapitalDialog from './CapitalDialog.vue';
const authStore = useAuthStore();
const editCapitalDialogOpen = ref(false);

</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="icon" class="aspect-square rounded-full">
        <Icon icon="tabler-user" class="h-4 w-4" />
        <span class="sr-only">Toggle user menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>
        {{ $t("My Account") }}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="authStore.logout()">
        {{ $t('Logout') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  <CapitalDialog v-model="editCapitalDialogOpen" />
</template>

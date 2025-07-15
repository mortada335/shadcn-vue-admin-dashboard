<script setup lang="ts" generic="T">
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Can from '../auth/Can.vue';
import { useI18n } from 'vue-i18n';
import { useIsRtl } from '@/composable/useRtl';
type itemCallback = (item: T) => any
defineProps<{
  item: T,
  editCallback: itemCallback,
  deleteCallback: itemCallback,
  permissions: { update: string, delete: string }
}>()

const slots = useSlots();

const hasSlot = (name: string) => !!slots[name]

const isRtl = computed(() => useI18n().locale.value == 'ar')

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <icon icon="tabler-dots-vertical" class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel class="text-center">{{ $t('Actions') }}</DropdownMenuLabel>
      <Can :permission="permissions.update">
        <DropdownMenuSeparator />
        <DropdownMenuItem class="flex justify-end" :class="isRtl ? 'flex-row' : 'flex-row-reverse'"
          @click="editCallback(item)">
          {{ $t("Edit") }}
          <icon icon="tabler-edit" />
        </DropdownMenuItem>
      </Can>
      <Can :permission="permissions.delete">
        <DropdownMenuSeparator />
        <DropdownMenuItem class="flex justify-end" :class="isRtl ? 'flex-row' : 'flex-row-reverse'"
          @click="deleteCallback(item)">
          {{ $t("Delete") }}
          <icon icon="tabler-trash" />
        </DropdownMenuItem>
      </Can>
      <template v-if="hasSlot('default')">
        <DropdownMenuSeparator />
        <slot :item />
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

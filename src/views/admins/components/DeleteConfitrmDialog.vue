<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <AlertTriangle class="h-5 w-5 text-destructive" />
          {{ isBulkDelete ? t('delete_multiple_admins') : t("delete_admin") }}
        </DialogTitle>
        <DialogDescription>
          <span v-if="isBulkDelete">
            {{t('are_you_sure_you_want_to_delete')}} <strong>{{ items?.length }} {{t("admins")}}</strong>?
          </span>
          <span v-else>
            {{t('are_you_sure_you_want_to_delete')}} <strong>{{ items?.[0]?.name }}</strong>?
          </span>
          <br />
          <span class="text-destructive font-medium">{{t("this_action_cannot_be_undone.")}}</span>
        </DialogDescription>
      </DialogHeader>

      <div v-if="isBulkDelete && items" class="max-h-32 overflow-y-auto">
        <div class="space-y-1">
          <div 
            v-for="item in items" 
            :key="item.id"
            class="flex items-center gap-2 text-sm"
          >
            <Avatar class="h-6 w-6">
              <AvatarImage v-if="item.avatar" :src="item.avatar" :alt="item.name" />
              <AvatarFallback class="text-xs">{{ getInitials(item.name) }}</AvatarFallback>
            </Avatar>
            <span>{{ item.name }}</span>
            <span class="text-muted-foreground">({{ item.email }})</span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button 
          variant="outline" 
          @click="$emit('update:open', false)"
          :disabled="loading"
        >
          {{t("cancel")}}
        </Button>
        <Button 
          variant="destructive" 
          @click="handleConfirm"
          :disabled="loading"
        >
          <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
          {{ isBulkDelete ? `${t("delete")} ${items?.length} ${t("Admins")}` : t('delete_admin') }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AlertTriangle, Loader2 } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Admin } from '@/types/admins'
import { useI18n } from 'vue-i18n'


const {t} = useI18n()

const props = defineProps<{
  open: boolean
  items?: Admin[] | null
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'confirm': []
}>()

const isBulkDelete = computed(() => (props.items?.length || 0) > 1)

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleConfirm = () => {
  emit('confirm')
}
</script>
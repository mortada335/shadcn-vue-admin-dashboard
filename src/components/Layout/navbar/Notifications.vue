<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NotificationDialog from './NotificationDialog.vue';
import { useNotification } from '@/composable/useNotification';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
const isNotificationDialogOpen = ref(false);
const { markAllAsRead, readNotification, fetchNotifications, notifications, isFetching } = useNotification();
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  const isScrolledToBottom =
    (target.scrollTop + target.clientHeight) / target.scrollHeight > 0.8;
  if (isScrolledToBottom)
    fetchNotifications(true);
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button @click="() => fetchNotifications()" variant="outline">
        <icon icon="tabler-bell" width="24" height="24" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent @scroll="handleScroll" class="w-[300px] max-h-[400px] overflow-y-auto form-scrollbar">
      <DropdownMenuLabel class="flex justify-between">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button @click="markAllAsRead" class="size-6">
              <icon icon="tabler-mail-opened" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{{ $t("Mark All As Read") }}</span>
          </TooltipContent>
        </Tooltip>
        <span class="grow text-center">{{ $t("Notifications") }}</span>
        <Tooltip v-if="false">
          <TooltipTrigger as-child>
            <Button @click="isNotificationDialogOpen = true" class="float-end size-6">
              <icon icon="tabler-plus" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{{ $t("Post New Notification") }}</span>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <template v-for="_ in 20">
        <DropdownMenuItem class="flex items-center gap-3">
          <icon icon="tabler-package" class="aspect-square border rounded-full w-5 text-lg" />
          <span>{{ 'test' }}</span>
          <span class="text-xs text-muted-foreground float-end">
            {{ new Date().toLocaleDateString() }}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </template>
      <template v-for="(notification, i) in notifications">
        <DropdownMenuItem @click="() => readNotification(notification.id)" class="flex items-center gap-3">
          <icon v-if="!notification.isRead" icon="tabler-dot" class="aspect-square border rounded-full w-5 text-lg" />
          <span>{{ notification.content }}</span>
          <span class="text-xs text-muted-foreground float-end">
            {{ new Date().toLocaleDateString() }}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="i != notifications.length" />
      </template>
      <template v-if="notifications.length == 0 && !isFetching">
        <DropdownMenuItem class="flex justify-center text-center">
          <span>{{ $t("You don't have any notifications") }}</span>
        </DropdownMenuItem>
      </template>
      <template v-if="isFetching">
        <DropdownMenuItem class="flex items-center gap-3">
          <Skeleton class="w-full h-5" />
        </DropdownMenuItem>
      </template>

    </DropdownMenuContent>
  </DropdownMenu>
  <NotificationDialog v-model="isNotificationDialogOpen" />
</template>

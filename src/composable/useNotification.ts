import { Base_URL } from "@/api";
import $api from "@/api/api";
import { useAuthStore } from "@/stores/auth";
import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { ref } from "vue";

export interface NotificationModel {
  id: string,
  isRead: boolean,
  content: string,
  type: string,
  metaData: string,
}

export interface GeneralNotificationCallbackProps {
  notificationMode: NotificationModel,
  users: string[],
}

export interface UserNotificationCallbackProps {
  notificationMode: NotificationModel,
  user: string[],
}

export interface GroupNotificationCallbackProps {
  notificationMode: NotificationModel,
}

const canFetch = ref(false);
const isFetching = ref(false);
const notifications = ref<NotificationModel[]>([]);
let lastFetchedPage = 1;
const pageSize = 20;

export const useNotification = () => {

  const authStore = useAuthStore();

  const connection = new HubConnectionBuilder()
    .withUrl(Base_URL + 'notification/notification-hub', {
      accessTokenFactory: () => authStore.accessToken.value
    })
    .configureLogging(LogLevel.Information)
    .build();


  const onReceiveNotification = (callback: (params: GeneralNotificationCallbackProps) => void) => {
    connection.on('ReceiveNotification', (args) => {
      callback(args)
    })
  }

  const readNotification = (id: string) => {
    if (connection.state == HubConnectionState.Connected)
      connection.send('ReadNotification', id)
  }
  const markAllAsRead = async () => {
    await $api.post(Base_URL + 'notification/api/notifications');
  }
  const fetchNotifications = async (append?: boolean) => {
    if (isFetching.value) return;
    isFetching.value = true;
    if (append) {
      if (!canFetch.value) return;
      const { data: { items } } = await $api.get(Base_URL + 'notification/api/notifications', {
        params: {
          pageNumber: lastFetchedPage,
          pageSize: pageSize,
        }
      })
      notifications.value = [...notifications.value, ...items];
      lastFetchedPage++;
      if (items.length < pageSize) canFetch.value = false;
    } else {
      lastFetchedPage = 1;
      const { data: { items } } = await $api.get(Base_URL + 'notification/api/notifications', {
        params: {
          pageNumber: lastFetchedPage,
          pageSize: pageSize,
        }
      })
      notifications.value = items;
    }
    isFetching.value = false;
  }

  const start = async () => {
    await connection.start();
  }

  const stop = async () => {
    await connection.stop();
  }

  return {
    start,
    stop,
    onReceiveNotification,
    readNotification,
    markAllAsRead,
    fetchNotifications,
    notifications,
    isFetching
  }
}

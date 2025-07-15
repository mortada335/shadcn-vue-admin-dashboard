import $api_public from "@/api/api-public";
import { useCookie } from "@/composable/useCookie";
import router from "@/plugins/router";
import type { Currency } from "@/views/currencies/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";


enum SubscriptionStatus {
  NotExpired = 1,
  AboutToExpire = 2,
  AlreadyExpired = 3
}


export interface User {
  name: string,
  email: string,
  permissions: string[],
  isTenantAdmin: boolean,
  subscriptionStatus: SubscriptionStatus,
  isSuperAdmin: boolean,
  subscriptionExpireDate: string,
  tenant?: { id: string, capital: number }
}

export const iraqiDinar = {
  symbol: 'IQD',
  code: 'IQD',
  name: 'Dinar',
  exchangeRate: 1,
};

export const useAuthStore = defineStore('auth-store', () => {
  const accessToken = computed(() => useCookie<string>('access-token'))
  const user = computed(() => useCookie<User>('user-data'))
  const permissions = computed(() => useCookie<string[]>('permissions'))
  const isUserExpired = computed(() => user.value.value?.subscriptionStatus == SubscriptionStatus.AlreadyExpired)
  const isUserAdmin = computed(() => user.value.value?.isSuperAdmin)
  const isUserAboutToExpire = computed(() => user.value.value?.subscriptionStatus == SubscriptionStatus.AboutToExpire)
  const activeCurrency = ref<Currency>(JSON.parse(localStorage.getItem('currency') ?? JSON.stringify(iraqiDinar)))

  // const setUserData = (user: User) => {
  //   useCookie('user-data').value = JSON.stringify({ ...user, permissions: undefined });
  //   useCookie('permissions').value = JSON.stringify(user.permissions)
  // }

  const login = (accessToken: string, accessTokenExpiryDate: Date, refreshToken: string, refreshTokenExpiryDate: Date) => {
    useCookie('user-data').value = null;
    useCookie('permissions').value = null;
    useCookie('access-token', { expires: accessTokenExpiryDate }).value = accessToken;
    useCookie('refresh-token', { expires: refreshTokenExpiryDate }).value = refreshToken;
  }
  const logout = () => {
    useCookie('access-token').value = null;
    useCookie('refresh-token').value = null;
    useCookie('user-data').value = null;
    useCookie('permissions').value = null;
    router.push('/login')
  }

  const can = (permission: string) => {
    return permissions.value.value != undefined && permissions.value.value.some((p) => p == permission)
  }

  // const refreshAccessToken = async () => {
  //   const refreshToken = useCookie('refresh-token').value
  //   if (refreshToken) {
  //     const { data: { token, tokenExpire, refreshToken: responseRefreshToken, refreshTokenExpire } } = await $api_public.post('authentication/refresh-token', {
  //       refreshToken: refreshToken
  //     })
  //     login(token, new Date(tokenExpire), responseRefreshToken, new Date(refreshTokenExpire))
  //   } else {
  //     router.push('/login')
  //   }
  // }

  return {
    user,
    login,
    logout,
    can,
    // setUserData,
    // isUserAdmin,
    permissions,
    accessToken,
    // refreshAccessToken,
    isUserExpired,
    isUserAboutToExpire,
    activeCurrency
  }
})

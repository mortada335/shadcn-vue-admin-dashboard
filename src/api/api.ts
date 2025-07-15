import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useCookie } from '@/composable/useCookie'
import axios from 'axios'
import { Base_URL, type ErrorResponse } from '.'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/components/ui/toast'
export const $api = axios.create({
  baseURL: Base_URL + 'api'
})

$api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  let accessToken = useCookie('access-token').value
  if (accessToken == undefined) {
    await useAuthStore().refreshAccessToken();
    accessToken = useCookie('access-token').value
  }

  if (accessToken == undefined) debugger;
  if (config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  else {
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
    }
  }

  return config as InternalAxiosRequestConfig
})

$api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    const { toast } = useToast();
    if (error.response?.status === 401) {
      toast({
        title: 'Error',
        description: 'Action Not Permitted',
        variant: 'destructive'
      })
      throw error
    }
    toast({
      title: 'Error',
      description: (error.response?.data as ErrorResponse).Detail ?? 'There has been an error',
      variant: 'destructive'
    })
    throw error
  },
)

export default $api

import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import { Base_URL } from '.'

export const $api_public = axios.create({
  baseURL: Base_URL + 'api'
})

$api_public.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    throw error
  },
)

export default $api_public

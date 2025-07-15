import { type GenericFormData } from "axios";
import $api from "../api";
import type { PaginatedResponse, PaginationOptions, SignleObjectReponse, getParams } from "./types";

export class Client {
  static async get<T extends object>(url: string, options: PaginationOptions, params?: getParams) {
    const res = await $api.get<PaginatedResponse<T>>(url, {
      params: {
        ...params,
        ...options
      }
    })
    return {
      totalCount: res.data.totalCount,
      totalPages: res.data.totalPages,
      currentPage: res.data.currentPage,
      data: res.data.data,
    }
  }
  static async getSingle<T extends object>(url: string, id: string) {
    const res = await $api.get<SignleObjectReponse<T>>(url + '/' + id)
    return res.data
  }
  static async delete(url: string, id: string) {
    await $api.delete(url + '/' + id)
  }
  static async update<T extends object>(url: string, object: T | GenericFormData) {
    const res = await $api.put<PaginatedResponse<T>>(url, object)
    return res.data
  }
  static async create<T extends object>(url: string, object: T | GenericFormData) {
    const res = await $api.post(url, object)
    return res.data
  }
}

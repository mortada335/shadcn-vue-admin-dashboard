export type getParams = Record<string, any>

export interface PaginatedResponse<T> {
  totalPages: number,
  pageSize: number,
  totalCount: number,
  currentPage: number,
  data: T[]
}

export type SignleObjectReponse<T> = T

export type PaginationOptions = {
  pageSize: number,
  pageNumber: number,
}

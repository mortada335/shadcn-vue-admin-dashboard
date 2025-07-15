export interface Material {
  id: string,
  name: string,
  isBreakable: boolean,
}

export const QueryKeys = {
  getAll: 'materials-get-all',
  getSingle: 'materials-get-single',
  update: 'materials-update',
  create: 'materials-create',
} as const

export const Permissions = {
  get: 'GetMaterialDetailsRequest',
  getAll: 'GetAllMaterialsRequest',
  getDeleted: 'GetDeletedMaterialsRequest',
  update: 'UpdateMaterialRequest',
  create: 'CreateMaterialRequest',
  delete: 'DeleteMaterialRequest',
}

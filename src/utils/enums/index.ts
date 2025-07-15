type AppEnumColor =
  "default" | "primary" | "info" |
  "success" | "warning" | "error";

export type AppEnumValue = number | string | unknown;
export interface AppEnum {
  name: string,
  value: AppEnumValue
  color?: AppEnumColor,
  icon?: string
}
export type AppEnumGroup = Array<AppEnum>

export const UserRoles: AppEnumGroup = [
  {
    name: 'Super Admin',
    value: '1',
  },
  {
    name: 'Admin',
    value: '2',
  },
  {
    name: 'Manager',
    value: '3',
  },
  {
    name: '4',
    value: '4',
  },
  {
    name: '5',
    value: '5',
  },
  {
    name: 'role6',
    value: '6',
  },
]

export const MaterialBreakage: AppEnumGroup = [
  {
    name: 'Yes',
    value: true,
  },
  {
    name: 'No',
    value: false,
  },
]

export const TransactionTypeParent: AppEnumGroup = [
  {
    name: 'Profits',
    value: 1,
  },
  {
    name: 'Expenses',
    value: 2,
  },
  {
    name: 'Losses',
    value: 3,
  },
]

export const ProductStatus: AppEnumGroup = [
  {
    name: 'Sold',
    value: 1,
  },
  {
    name: 'Consists',
    value: 2,
  },
  {
    name: 'Available',
    value: 3,
  },
]

export const TransactionRefrence: AppEnumGroup = [
  {
    name: 'Orders',
    value: 1,
  },
  {
    name: 'Purchases',
    value: 2,
  },
  {
    name: 'Others',
    value: 3,
  },
]

export const OrderStatus: AppEnumGroup = [
  {
    name: 'New',
    value: 1,
  },
  {
    name: 'Pending',
    value: 2,
  },
  {
    name: 'Canceled',
    value: 3,
  },
  {
    name: 'Delayed',
    value: 4,
  },
  {
    name: 'Completed',
    value: 5,
  },
  {
    name: 'Refund',
    value: 6,
  },
  {
    name: 'Delivered',
    value: 7,
  },
  {
    name: 'WaitingDelivered',
    value: 8,
  },
]

export const PaymentMethod: AppEnumGroup = [
  {
    name: 'Cash',
    value: 1,
  }
]


const getEnumByValue = (enumGroup: AppEnumGroup, value: AppEnumValue) => {
  const appEnum = enumGroup.find((e) => e.value === value);
  return appEnum ?? enumGroup[0];
}

const getEnumByKey = (enumGroup: AppEnumGroup, key: keyof typeof enumGroup[0], value: unknown) => {
  const appEnum = enumGroup.find((e) => e[key] === value);
  return appEnum ?? enumGroup[0];
}

export {
  getEnumByKey,
  getEnumByValue,
}

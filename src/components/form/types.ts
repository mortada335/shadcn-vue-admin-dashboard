import type { YupSchema } from "vee-validate"
import type { NumberSchema, StringSchema } from "yup"

export interface Validated {
  name: string
  validation: StringSchema<string | undefined> | NumberSchema<number | undefined> | YupSchema<any | undefined>
}

export interface FormField {
  name: string
  label: string,
  placeholder: string,
  disabled?: boolean,
  type: 'text' | 'number' | 'email' | 'password'
  id?: string
  validation: StringSchema<string | undefined> | NumberSchema<number | undefined>
}

export interface FieldValidation {
  name: string
  validate: ValidateFunctionType
}

export const FormRegisterInjectionKey = 'validation-register'
export const FormUnregisterInjectionKey = 'validation-unregister'
export type ValidateFunctionType = () => { errors: String[], valid: boolean, value: any | undefined }

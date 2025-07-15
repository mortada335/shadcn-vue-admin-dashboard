interface BaseProps {
  label?: string,
  placeholder?: string,
  id?: string,
  class?: string
  disabled?: boolean
}

export interface BaseInputProps extends BaseProps {
  type: 'text' | 'number' | 'email' | 'password'
}

export interface TextareaInputProps extends BaseProps {
}

export interface CurrencyInputProps extends BaseProps {
}

export interface DateInputProps extends BaseProps {
}

export interface FileInputProps {
  label: string
  accept?: string
  multiple?: boolean
}

export interface SelectInputProps extends BaseProps {
  itemLabel: string,
  itemValue: string,
  items: any[],
}

export interface SliderInputProps extends BaseProps {
  max: number,
  min: number,
  step: number,
}

export interface AutocompleteInputProps extends BaseProps {
  itemLabel: string,
  itemValue: string,
  getUrl?: string,
  searchKey?: string,
  exclude?: any[],
  defaultParams?: Record<string, any>
  items?: any[],
  multiple?: boolean
}

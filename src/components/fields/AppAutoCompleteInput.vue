<script setup lang="ts">
import $api from '@/api/api'
import { AutocompleteInputProps } from '@/components/fields/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/vue-query'
import { watchDebounced } from '@vueuse/core'

const props = defineProps<AutocompleteInputProps>()
const searchKey = computed(() => props.searchKey || 'text')
const search = ref('')

const open = ref(false)

const model = defineModel<any>()
const value = ref<any>(props.items ? props.items.find(i => i[props.itemValue] == model.value) : model.value)
const emit = defineEmits<{
  update: [value: string],
}>()


const defaultQueryKeys = computed(() => {
  const keys: string[] = [];
  keys.push('autocomplete')
  if (props.getUrl)
    keys.push(props.getUrl)
  if (props.defaultParams)
    for (const key in props.defaultParams) {
      keys.push(`${key}:${props.defaultParams[key]}`)
    }
  keys.push('searchPlaceholder')
  return keys
})

const queryKeys = ref(defaultQueryKeys.value);

const removeEntry = (i: number) => {
  value.value.splice(i, 1)
  setModelValue(value.value);
}

const addEntry = (entry: any) => {
  if (!value.value)
    value.value = [];
  const index = value.value.findIndex((v: any) => v[props.itemValue] == entry[props.itemValue])
  if (index == -1)
    value.value.push(entry)
  else
    removeEntry(index)
}


const isValueChoosen = (val: any) => {
  if (!value.value) return false;
  if (Array.isArray(value.value)) {
    return value.value.findIndex((v: any) => v[props.itemValue] == val[props.itemValue]) != -1;
  }
  return value.value[props.itemValue] == val[props.itemValue];
}

const fetchData = async (searchTerm?: string) => {
  let params = { ...props.defaultParams }
  if (searchTerm)
    params = { ...params, [searchKey.value]: searchTerm }

  const { data: { items: responseItems } } = await $api.get(props.getUrl!, { params: { ...params, pageSize: 20 } })
  return responseItems;
}



const getValueFromModel = async (v: any) => {
  if (typeof v == 'string') {
    const { data: newVal } = await $api.get(props.getUrl + '/' + v)
    value.value = newVal;
  }
  else if (Array.isArray(v) && v.some((i: any) => typeof i == 'string')) {
    const newArray = []
    for (let i = 0; i < value.value.length; i++) {
      const { data: newVal } = await $api.get(props.getUrl + '/' + v[i])
      newArray.push(newVal);
    }
    value.value = newArray;
  }
}

const setModelValue = (v: any) => {
  if (!v) {
    model.value = undefined;
    return
  }
  if (Array.isArray(v)) model.value = v.map(v => v[props.itemValue])
  else model.value = v[props.itemValue]
}

const resetValue = () => {
  value.value = undefined
  setModelValue(undefined)
}

const updateQueryKeys = (v: string) => {
  const keys = queryKeys.value;
  keys.pop()
  if (v)
    keys.push(`search:${v}`)
  else
    keys.push('searchPlaceholder')
  queryKeys.value = keys;
}

const { data: queryData, isFetching, } = useQuery({
  queryKey: queryKeys,
  staleTime: 60 * 1000,
  queryFn: async () => {
    return await fetchData(search.value)
  },
  enabled: () => { return !!props.getUrl }
})

watchDebounced(search, (v) => {
  updateQueryKeys(v)
}, { debounce: 200 })

watch(value, (v) => {
  getValueFromModel(v)
}, { immediate: true, deep: true })

watch(model, (v) => {
  emit('update', v)
})

const options = computed(() => {
  if (props.items) {
    return props.items.filter(v => v[props.itemLabel].includes(search.value))
  }
  return queryData.value.filter((v: any) => props.exclude?.find((x) => x[props.itemValue] == v[props.itemValue]) == null);
})

</script>
<template>
  <div class="grid w-full items-center gap-3">
    <Label v-if="label" :for="id">{{ $t(label) }}</Label>
    <Popover :disabled v-model:open="open">
      <PopoverTrigger as-child>
        <Button @click="open = true" variant="outline" role="combobox" class="justify-start h-auto">
          <div class="flex-grow flex justify-start">
            <template v-if="value">
              <template v-if="Array.isArray(value)">
                <div class="flex justify-start gap-1 flex-wrap">
                  <Badge variant="default" v-for="(v, i) in value">
                    {{ props.items ? $t(v[itemLabel]) : v[itemLabel] }}
                    <div @click="removeEntry(i)">
                      <icon icon="tabler-x" class="opacity-50" />
                    </div>
                  </Badge>
                </div>
              </template>
              <template v-else>
                <Badge class="gap-2" variant="default">
                  {{ props.items ? $t(value[itemLabel]) : value[itemLabel] }}
                </Badge>
              </template>
            </template>
            <template v-else>
              {{ $t(placeholder ?? '') }}
            </template>
          </div>
          <div v-if="value" @click="resetValue()">
            <icon icon="tabler-x" class="opacity-50" />
          </div>
          <icon icon="tabler-selector" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="p-0">
        <!-- a work around for the fucking forced filtering -->
        <Command v-model:search="search" :resetSearchTermOnBlur="false"
          :filter-function="(list: any[]) => { return list }">
          <CommandInput class="w-full h-9" :placeholder="$t('Search')" />
          <CommandEmpty>{{ $t('No results') }}</CommandEmpty>
          <CommandList class="form-scrollbar">
            <CommandGroup>
              <template v-if="isFetching">
                <CommandItem class="mb-1" v-for="_ in 5" key="loading" value="loading">
                  <Skeleton class="h-3" />
                </CommandItem>
              </template>
              <CommandItem v-else v-for="option in options" :key="option[itemValue]" :value="option[itemValue]" @select="() => {
                if (multiple) {
                  addEntry(option)
                  setModelValue(value)
                } else {
                  value = option
                  setModelValue(option)
                  open = false
                }
              }">
                <slot name="option" :option="option">
                  {{ props.items ? $t(option[itemLabel]) : option[itemLabel] }}
                </slot>
                <icon icon="tabler-check" :class="cn(
                  'ml-auto h-4 w-4',
                  isValueChoosen(option) ? 'opacity-100' : 'opacity-0',
                )" />

              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    <slot />
  </div>
</template>

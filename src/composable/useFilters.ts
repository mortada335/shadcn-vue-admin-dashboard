import type { FetchFn, FilterField, ParamsType } from "@/utils/filters/types/filters"
import { watchDebounced } from "@vueuse/core";
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  getLocalTimeZone,
} from '@internationalized/date'
import { useTableStore } from "@/stores/table";


export const useFilters = (filterModel: FilterField[], fetchFn: FetchFn) => {
  const router = useRouter();
  const tableStore = useTableStore();

  let filters = reactive<ParamsType>({ ...useRoute().query });

  filterModel?.forEach(f => {
    if (!filters[f.key] && f.options?.defaultValue)
      filters[f.key] = f.options.defaultValue;
  })


  const generateQuery = (filters: ParamsType) => {
    const params: Record<string, string | any> = {};
    filterModel?.forEach(f => {
      const currentFilter = filters[f.key]
      if (typeof currentFilter == 'number' || typeof currentFilter == 'boolean' || (typeof currentFilter == 'string'))
        params[f.key] = typeof filters[f.key] == 'string' && filters[f.key] == '' ? undefined : filters[f.key].toString();
      else if (typeof currentFilter == 'object' && currentFilter.toDate) {
        params[f.key] = (filters[f.key].toDate(getLocalTimeZone()) as Date).toISOString();
      } else if (Array.isArray(filters[f.key])) {
        params[f.key] = filters[f.key];
      }
    })
    return params;
  }

  const clearFilters = () => {
    for (const prop in filters) {
      delete filters[prop]
    }
  }

  watchDebounced([filters], async ([value]) => {
    tableStore.resetNumber();
    const query = generateQuery(value);
    await router.push({
      query
    })
    fetchFn();
  }, { deep: true, debounce: 300 })

  return {
    filters,
    clearFilters,
  }
}

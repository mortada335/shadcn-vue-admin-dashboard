<script setup lang="ts">
import { FetchFn, FilterField } from '@/utils/filters/types/filters';
import { Button } from '@/components/ui/button';
import { useFilters } from '@/composable/useFilters';
import AppTextInput from '../fields/AppTextInput.vue';
import AppDateInput from '../fields/AppDateInput.vue';
import AppAutoCompleteInput from '../fields/AppAutoCompleteInput.vue';

const props = withDefaults(defineProps<{
  filters: FilterField[]
  fetchFn: FetchFn,
  clearable?: boolean
}>(), {
  clearable: true
})

const { filters: filterObject, clearFilters } = useFilters(props.filters, props.fetchFn)

</script>
<template>
  <template v-if="props.filters">
    <div class="grid grid-cols-3 grid-flow-row w-full gap-2 mb-1 p-3">
      <template v-for="filter in props.filters.filter((f: FilterField) => f.hide ? !f.hide() : true)">
        <slot :name="`filter.${filter.key}`" :filter="filter">
          <AppTextInput v-if="filter.type !== 'select' && filter.type !== 'date'" :type="filter.type ?? 'text'"
            :label="filter.label" v-model="filterObject[filter.key]" />
          <AppDateInput v-else-if="filter.type === 'date'" :placecholder="filter.label" :label="filter.label"
            v-model="filterObject[filter.key]" />
          <AppAutoCompleteInput v-else :items="filter.options?.items" v-model="filterObject[filter.key]"
            :getUrl="filter.options?.getUrl!" :searchKey="filter.options?.searchKey!"
            :itemValue="filter.options?.itemValue!" :itemLabel="filter.options?.itemLabel!" multiple
            :label="filter.label" :placeholder="filter.label" />
        </slot>
      </template>
    </div>
    <div v-if="clearable" class="flex justify-end">
      <Button @click="clearFilters" prepend-icon="tabler-rotate">
        {{ $t("Clear Filters") }}
      </Button>
    </div>
  </template>
</template>

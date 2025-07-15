<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FetchFn, FilterField } from "@/utils/filters/types/filters";
import AppFilters from "./AppFilters.vue";
defineProps<{
  mainFilter?: FilterField
  filters?: FilterField[]
  fetchFn?: FetchFn
}>()
</script>
<template>
  <div class="container py-10 mx-auto">
    <Card class="w-full py-4 px-4 mb-3">
      <Collapsible class="w-full border-0 overflow-hidden">
        <div>
          <div class="flex gap-2 flex-wrap items-center">
            <div class="w-full lg:w-1/2">
              <AppFilters v-if="mainFilter && fetchFn" :filters="[mainFilter]" :fetchFn :clearable="false" />
            </div>
            <div class="flex-grow" />
            <slot name="actions" />
            <CollapsibleTrigger v-if="filters">
              <Button>
                {{ $t("Filters") }}
                <icon icon="tabler-search" />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent v-if="filters && fetchFn">
            <AppFilters :filters :fetchFn />
          </CollapsibleContent>
        </div>
      </Collapsible>
    </Card>
    <slot />
  </div>
</template>

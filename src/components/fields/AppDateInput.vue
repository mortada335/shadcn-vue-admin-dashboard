<script setup lang="ts">
import { DateInputProps } from '@/components/fields/types'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  ZonedDateTime,
} from '@internationalized/date'
import { useI18n } from 'vue-i18n';

const isRtl = computed(() => useI18n().locale.value == 'ar')
const locale = computed(() => isRtl.value ? 'ar' : 'en')

const df = new DateFormatter(locale.value, {
  dateStyle: 'long',
})

defineProps<DateInputProps>()

const modelValue = defineModel<string>({ default: '' })
const value = ref<DateValue | undefined>(modelValue.value ?
  new ZonedDateTime(new Date(modelValue.value).getFullYear(), new Date(modelValue.value).getMonth() + 1, new Date(modelValue.value).getDate(), getLocalTimeZone(), 0) : undefined
)

watchEffect(() => {
  modelValue.value = value.value?.toDate(getLocalTimeZone()).toISOString() ?? '';
})

</script>

<template>
  <Popover>
    <div class="grid w-full max-w-sm items-center gap-3">
      <Label v-if="label" :for="id">{{ $t(label) }}</Label>
      <PopoverTrigger :disabled as-child>
        <Button variant="outline" :class="cn(
          'w-full h-10 justify-start flex font-normal',
          !value && 'text-muted-foreground',
        )">
          <icon icon="tabler-calendar-week" class="mr-2 h-4 w-4" />
          {{ value ? value.toDate ? df.format(value.toDate(getLocalTimeZone())) : value :
            $t(placeholder ?? '') }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar v-model="value" :locale initial-focus />
      </PopoverContent>
      <slot />
    </div>
  </Popover>
</template>

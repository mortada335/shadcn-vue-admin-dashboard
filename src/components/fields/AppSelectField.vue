<script setup lang="ts">
import { SelectInputProps } from '@/components/fields/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
defineProps<SelectInputProps>()
const value = defineModel<string>()
</script>

<template>
  <div class="grid w-full max-w-sm items-center gap-2">
    <Label v-if="label" :for="id">{{ $t(label) }}</Label>
    <Select :disabled v-model="value">
      <SelectTrigger class="w-full h-10">
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem v-for="item in items" :value="item[itemValue]">
            {{ $t(item[itemLabel] ?? '') }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
      <slot />
    </Select>
  </div>
</template>

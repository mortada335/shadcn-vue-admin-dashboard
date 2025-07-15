<script setup lang="ts">
import { Button } from '@/components/ui/button';
import AppForm from '../form/AppForm.vue';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { breakpointsTailwind } from '@vueuse/core';
defineProps<{
  title: string,
  size: 'md' | 'lg' | 'xl' | 'sm' | '2xl',
  isLoading: boolean
}>()
const formObject = useTemplateRef('form')
const model = defineModel<boolean>();

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
}>()

const onSubmit = async () => {
  if ((await formObject.value?.isValid())) {
    emit('submit')
  }
}

const onCancel = () => {
  emit('cancel')
  model.value = false;
}

</script>
<template>
  <Dialog v-model:open="model">
    <DialogContent class="p-5" :style="`width: ${breakpointsTailwind[size]}px`">
      <DialogHeader>
        <DialogTitle>{{ $t(title) }}</DialogTitle>
      </DialogHeader>
      <div class="overflow-y-auto max-h-[70vh] px-2 form-scrollbar">
        <AppForm ref="form">
          <Skeleton v-if="isLoading" class="w-full" :style="`height: 50vh`" />
          <slot v-else />
          <DialogFooter class="my-2">
            <Button variant="secondary" @click="onCancel">
              {{ $t("Cancel") }}
            </Button>
            <Button type="submit" variant="default" @click="onSubmit">
              {{ $t("Submit") }}
            </Button>
          </DialogFooter>
        </AppForm>
      </div>
    </DialogContent>
  </Dialog>
</template>

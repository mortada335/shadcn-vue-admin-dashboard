<script setup lang="ts">
import { FieldValidation, FormField, FormRegisterInjectionKey, FormUnregisterInjectionKey, ValidateFunctionType } from '@/components/form/types';
import AppFormInput from './AppFormTextInput.vue';

defineProps<{
  fields?: FormField[]
  auto?: boolean
}>()


const fieldValidations = ref<FieldValidation[]>([])
const emit = defineEmits(['submit']);

const register = (fv: FieldValidation) => {
  fieldValidations.value.push(fv)
}

const unregister = (name: string) => {
  const index = fieldValidations.value.findIndex(fv => fv.name == name)
  if (index == -1) return
  fieldValidations.value.splice(index, 1)
}

provide(FormRegisterInjectionKey, register)
provide(FormUnregisterInjectionKey, unregister)

const isValid = async () => {
  let isValid = true
  const res = await Promise.all(fieldValidations.value.map(fv => fv.validate()))
  res.forEach(r => {
    if (!r.valid)
      isValid = false
  });
  return isValid
}
defineExpose({
  isValid
})
</script>
<template>
  <form @submit.prevent="() => emit('submit')">
    <template v-if="auto && fields">
      <AppFormInput v-for="field in fields" v-bind="field" />
    </template>
    <slot :isValid="isValid" />
  </form>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import AppInput from '../fields/AppTextareaInput.vue';
import { TextareaInputProps } from '../fields/types';
import { FormRegisterInjectionKey, FormUnregisterInjectionKey, Validated, FieldValidation } from './types';

const props = defineProps<Validated & TextareaInputProps>()

const { value, errorMessage, validate } = useField<string>(props.name, props.validation)

const errorModel = defineModel('error')
const model = defineModel<string>()

watch(errorMessage, (v) => { errorModel.value = v })
watch(model, (v) => { if (v != undefined) value.value = v }, { immediate: true })
defineExpose({
  validate
})
const register = inject<{ (fv: FieldValidation): void }>(FormRegisterInjectionKey)
const unregister = inject<{ (name: string): void }>(FormUnregisterInjectionKey)
onMounted(() => { register!({ name: props.name, validate: validate as any }) })
onUnmounted(() => { unregister!(props.name) })
</script>

<template>
  <AppInput :disabled :label :placeholder :id v-model="model">
    <div class="h-4 relative">
      <Transition name="slide">
        <p v-if="errorMessage" class="font-medium text-destructive  whitespace-nowrap text-sm absolute">
          {{ $t(errorMessage) }}</p>
      </Transition>
    </div>
  </AppInput>
</template>

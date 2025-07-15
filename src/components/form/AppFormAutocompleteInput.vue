<script setup lang="ts">
import { useField } from 'vee-validate';
import AppInput from '../fields/AppAutoCompleteInput.vue';
import { AutocompleteInputProps } from '../fields/types';
import { FormRegisterInjectionKey, FormUnregisterInjectionKey, Validated, FieldValidation } from './types';

const props = defineProps<Validated & AutocompleteInputProps>()

const { value, errorMessage, validate } = useField<string>(props.name, props.validation)

const errorModel = defineModel('error')
const model = defineModel<any>()

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
  <AppInput :disabled v-model="model" :multiple :label :placeholder :itemLabel :itemValue :items :id :getUrl :exclude
    :searchKey :defaultParams>
    <template #option="{ option }">
      <slot name="option" :option />
    </template>
    <div class="h-5 relative">
      <Transition name="slide">
        <p v-if="errorMessage" class="font-medium text-destructive  whitespace-nowrap text-sm absolute"> {{
          $t(errorMessage)
          }}
        </p>
      </Transition>
    </div>
  </AppInput>
</template>

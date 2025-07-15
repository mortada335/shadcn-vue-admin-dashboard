<script setup lang="ts">
import { string } from 'yup';
import UserLanguage from '@/components/Layout/navbar/UserLanguage.vue';
import Usertheme from '@/components/Layout/navbar/Usertheme.vue';
import AppForm from '@/components/form/AppForm.vue';
import { FormField } from '@/components/form/types';
import { Button } from '@/components/ui/button';
import AppFormInput from '@/components/form/AppFormTextInput.vue';
import $api_public from '@/api/api-public';
import { RouterLink, useRoute } from 'vue-router';
const route = useRoute()
const fields: FormField[] = [
  {
    name: 'password',
    placeholder: 'Enter your new Password',
    label: 'Password',
    type: 'password',
    validation: string().required()
  },
]
const password = ref('')
const form = useTemplateRef('form')
const onSubmit = async () => {
  if (!(await form.value?.isValid())) return;
  await $api_public.post('/authentication/confirm-reset-password', {
    token: route.params.token,
    password: password.value,
  })
}
</script>
<template>
  <div class="w-full lg:grid lg:grid-cols-2 h-screen">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">{{ $t("Password Reset") }}</h1>
          <p class="text-balance text-muted-foreground">
            {{ $t('Enter your new password below') }}
          </p>
        </div>
        <AppForm :fields="fields" @submit="onSubmit()" ref="form">
          <div class="flex flex-col gap-5">
            <AppFormInput v-bind="fields[0]" v-model="password" />
            <div class="flex justify-end my-3">
              <RouterLink to="/login">
                <Button variant="link" type="button">{{ $t("Login") }}</Button>
              </RouterLink>
            </div>
            <Button type="submit">{{ $t("Submit") }}</Button>
          </div>
        </AppForm>
      </div>
    </div>
    <div class="hidden lg:flex justify-center items-center h-full bg-muted  dark:bg-primary-foreground relative">
      <div class="absolute top-0 end-0 p-3 flex gap-3">
        <UserLanguage />
        <Usertheme />
      </div>
      <icon icon="tabler-building-warehouse" class="h-[500px] w-[524px] object-cover" />
    </div>
  </div>
</template>

<route lang="yaml">
  meta:
    layout: blank
</route>

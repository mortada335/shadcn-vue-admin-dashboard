<script setup lang="ts">
import { string } from "yup";
import UserLanguage from "@/components/Layout/navbar/UserLanguage.vue";
import Usertheme from "@/components/Layout/navbar/Usertheme.vue";
import AppForm from "@/components/form/AppForm.vue";
import { FormField } from "@/components/form/types";
import { Button } from "@/components/ui/button";
import AppFormInput from "@/components/form/AppFormTextInput.vue";
import $api_public from "@/api/api-public";
import { useAuthStore } from "@/stores/auth";
import { RouterLink, useRoute, useRouter } from "vue-router";
import $api from "@/api/api";
import { Skeleton } from "@/components/ui/skeleton";
const authStore = useAuthStore();
const router = useRouter();
const fields: FormField[] = [
  {
    name: "email",
    placeholder: "Enter your E-mail",
    label: "Email",
    type: "email",
    validation: string().email().required(),
  },
  {
    name: "password",
    placeholder: "Enter your Password",
    label: "Password",
    type: "password",
    validation: string().required(),
  },
];

const email = ref();
const password = ref();
const isLoading = ref(false);
const emailErrors = ref<string>();
const passwordErrors = ref<string>();
const form = useTemplateRef("form");
const onSubmit = () => {
  router.push("/");
  // if (!(await form.value?.isValid())) return;
  // isLoading.value = true;
  // try {
  //   const {
  //     data: { token, tokenExpire, refreshToken, refreshTokenExpire },
  //   } = await $api_public.post("/Auth/login", {
  //     email: email.value,
  //     password: password.value,
  //   });
  //   authStore.login(
  //     token,
  //     new Date(tokenExpire),
  //     refreshToken,
  //     new Date(refreshTokenExpire)
  //   );
  //   const { data } = await $api.get("/profiles/me");
  //   authStore.setUserData(data);
  //   router.push("/");
  // } catch {
  //   emailErrors.value = "wrong email or password";
  // } finally {
  //   isLoading.value = false;
  // }
};
</script>
<template>
  <div class="w-full lg:grid lg:grid-cols-2 h-screen">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">{{ $t("Login") }}</h1>
          <p class="text-balance text-muted-foreground">
            {{ $t("Enter your email below to login to your account") }}
          </p>
        </div>
        <AppForm :fields="fields" @submit="onSubmit()" ref="form">
          <div class="flex flex-col gap-5">
            <AppFormInput
              v-bind="fields[0]"
              v-model="email"
              v-model:error="emailErrors"
            />
            <AppFormInput
              v-bind="fields[1]"
              v-model="password"
              v-model:error="passwordErrors"
            />
            <div class="flex justify-end my-3">
              <RouterLink to="/forgot-password">
                <Button variant="link" type="button">{{
                  $t("Forgot Password?")
                }}</Button>
              </RouterLink>
            </div>
            <Button type="submit">
              <template v-if="!isLoading">
                {{ $t("Log in") }}
              </template>
              <template v-else>
                <Skeleton class="w-full h-full" />
              </template>
            </Button>
          </div>
        </AppForm>
      </div>
    </div>
    <div
      class="hidden lg:flex justify-center items-center h-full bg-muted dark:bg-primary-foreground relative"
    >
      <div class="absolute top-0 end-0 p-3 flex gap-3">
        <UserLanguage />
        <Usertheme />
      </div>
      <icon
        icon="tabler-building-warehouse"
        class="h-[500px] w-[524px] object-cover"
      />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: blank
</route>

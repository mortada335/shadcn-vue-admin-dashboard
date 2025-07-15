<template>
  <RouterView />
  <Toaster />
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import Toaster from "@/components/ui/toast/Toaster.vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/plugins/router";

const { locale } = useI18n();
const initLanguageAndDirection = () => {
  const lang = localStorage.getItem("language") || "ar";
  locale.value = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
};

onMounted(() => {
  initLanguageAndDirection();
  router.push("/");
});
</script>

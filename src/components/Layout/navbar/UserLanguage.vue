<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n';

const currentLang = ref(localStorage.getItem('language') || 'ar');
const { locale } = useI18n({ useScope: 'global' })

const updateLanguage = (lang: string) => {
  currentLang.value = lang;
  locale.value = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  localStorage.setItem('language', lang);
}

watch(currentLang, (lang) => updateLanguage(lang));

updateLanguage(currentLang.value);
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        <icon icon="tabler-language" width="24" height="24" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>
        {{ $t("change a language") }}
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup v-model="currentLang">
        <DropdownMenuRadioItem value="en">
          {{ $t("English") }}
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="ar">
          {{ $t("Arabic") }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

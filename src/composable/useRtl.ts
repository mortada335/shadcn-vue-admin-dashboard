import { useI18n } from "vue-i18n";

export const useIsRtl = () => useI18n().locale.value == 'ar'

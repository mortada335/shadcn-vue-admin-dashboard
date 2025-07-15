import { useI18n } from "vue-i18n"
import { number, string } from "yup"

export const isNumber = () => {
  return string().matches(/^([0-9]*[.])?[0-9]+$/, 'this must consist of only numbers')
}

export const isPercentage = () => {
  const { t } = useI18n();
  return number().lessThan(101, `${t('this must bet between')} 0 ${t('and')} 100`).moreThan(-1, `${t('this must bet between')} 0 ${t('and')} 100`)
}

export const isPhoneNumber = () => {
  return string().matches(/^07(5|7|8|9)\d{8}$/, 'this must be a valid phone number')
}

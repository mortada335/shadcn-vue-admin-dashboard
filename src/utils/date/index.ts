import { DateFormatter } from "@internationalized/date";

export const formatDateAsString = (date: string | Date) => {
  if (!date) return '-';
  const locale = localStorage.getItem('language') ?? 'ar';
  const df = new DateFormatter(locale);
  return df.format(new Date(date))
}

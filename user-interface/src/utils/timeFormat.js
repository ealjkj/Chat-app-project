import { format } from "date-fns";
import { enUS, es, fr } from "date-fns/locale";
const locales = {
  en: enUS,
  es: es,
  fr: fr,
};

export const timeDisplay = (time, { language }) => {
  return format(new Date(time), "p", { locale: locales[language] });
};

export const dateDisplay = (date, { language }) => {
  return format(new Date(date), "P", { locale: locales[language] });
};

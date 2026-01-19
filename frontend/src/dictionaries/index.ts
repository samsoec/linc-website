import "server-only";

const dictionaries = {
  en: () => import("./en.json").then((module) => module.default),
  id: () => import("./id.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  // Fallback to 'en' if locale is not supported
  const dictionaryLoader = dictionaries[locale] || dictionaries.en;
  return dictionaryLoader();
};

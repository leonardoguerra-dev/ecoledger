// Explicit type definition for the supported dictionaries
const dictionaries = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  it: () => import('@/locales/it.json').then((module) => module.default),
};

export type DictionaryType = Awaited<ReturnType<typeof dictionaries['en']>>;

/**
 * Enterprise dictionary loader for static/dynamic internationalization.
 * Defaults safely to English if an unsupported locale code is requested.
 */
export const getDictionary = async (lang: string): Promise<DictionaryType> => {
  if (lang === 'it') return dictionaries.it();
  return dictionaries.en(); // Fail-safe default
};
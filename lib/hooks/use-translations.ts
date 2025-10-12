import { useLocale } from 'next-intl';

export function useClientTranslations() {
  const locale = useLocale();
  
  return {
    locale,
    t: (key: string) => {
      // This is a simplified version - in production, you'd load the actual translations
      return key;
    }
  };
}

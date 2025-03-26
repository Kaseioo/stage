import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
	
    /**
	 * We are using HttpApi to load translations. Note that this isn't really needed,
     * but it allows us to load translations from a remote endpoint if needed.
     * https://github.com/i18next/i18next-http-backend
	 */
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already safes from xss
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to translation files
        },
        detection: {
            // honestly not really sure if we should be using this order since we are not using a backend at all
            // TODO: review detection order. 2025-03-26.
            order: [
                'querystring',
                'cookie',
                'localStorage',
                'navigator',
                'htmlTag',
                'path',
                'subdomain',
            ],
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            lookupLocalStorage: 'i18nextLng',
            // Cache user language on initial page load. Should prevent language flickering on page load.
            caches: ['localStorage', 'cookie'],
            excludeCacheFor: ['cimode'],
        },
    });

export default i18n;

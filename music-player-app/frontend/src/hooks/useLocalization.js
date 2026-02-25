import {translations} from "../locales/translations.js";
import {useState} from "react";

export const useLocalization = () => {
    const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'BG')

    /**
     * Change current lang
     *
     * @param lang
     */
    const changeLanguage = lang => {
        setLanguage(lang)
        localStorage.setItem('appLanguage', lang)
    }

    /**
     * Get translations
     *
     * @returns {*}
     */
    const getTranslations = () => translations[language]

    return {
        t: getTranslations(),
        language,
        changeLanguage
    }
}

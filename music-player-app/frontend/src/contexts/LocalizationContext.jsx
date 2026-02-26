import {createContext, useContext, useState} from "react";
import {translations} from "../locales/translations.js";


// eslint-disable-next-line react-refresh/only-export-components
export const LocalizationContext = createContext({})


// eslint-disable-next-line react-refresh/only-export-components
export const useLocalizationContext = () => useContext(LocalizationContext)


export function LocalizationProvider({children}) {
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

    return (
        <LocalizationContext.Provider
            value={{
                t: getTranslations(),
                language,
                changeLanguage
            }}
        >
            {children}
        </LocalizationContext.Provider>
    )
}

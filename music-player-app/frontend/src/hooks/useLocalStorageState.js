import {useState} from "react";
import secureLocalStorage from "react-secure-storage";

/**
 * Set or get data from secure local storage
 *
 * @param key
 * @param defaultValue
 * @returns {[any,function]}
 */
export default function useLocalStorageState(key, defaultValue = null) {
    const [state, setState] = useState(() => {
        const storageData = secureLocalStorage.getItem(key)

        if (storageData) {
            return JSON.parse(storageData)
        }

        return defaultValue
    })

    /**
     * Set value to secure local storage
     *
     * @param value
     */
    const setLocalStorageState = (value) => {
        setState(value)

        let serializedValue = JSON.stringify(
            typeof value === 'function'
                ? value(state)
                : value
        )

        secureLocalStorage.setItem(key, serializedValue)
    }

    return [
        state,
        setLocalStorageState,
    ]
}

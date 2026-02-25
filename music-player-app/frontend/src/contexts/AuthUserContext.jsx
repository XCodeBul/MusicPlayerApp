import {createContext, useContext} from "react";
import useLocalStorageState from "../hooks/useLocalStorageState.js";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthUserContext = createContext({})


// eslint-disable-next-line react-refresh/only-export-components
export const useAuthUserContext = () => useContext(AuthUserContext)


export function AuthUserProvider({children}) {
    const [user, setUser] = useLocalStorageState('user', null)

    return (
        <AuthUserContext.Provider
            value={{
                user,
                setAuthUser: data => setUser(data)
            }}
        >
            {children}
        </AuthUserContext.Provider>
    )
}

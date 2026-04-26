import { createContext, useContext, useEffect } from "react";
import useLocalStorageState from "../hooks/useLocalStorageState.js";
import { supabase } from "../supabaseClient.js"; // Увери се, че пътят е верен

export const AuthUserContext = createContext({});

export const useAuthUserContext = () => useContext(AuthUserContext);

export function AuthUserProvider({ children }) {
    const [user, setUser] = useLocalStorageState('user', null);

    useEffect(() => {
        // 1. Провери текущата сесия при зареждане
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUser(session.user);
        };
        getSession();

        // 2. Слушай за промени (Login, Logout, Register)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser]);

    return (
        <AuthUserContext.Provider
            value={{
                user,
                setAuthUser: data => setUser(data)
            }}
        >
            {children}
        </AuthUserContext.Provider>
    );
}
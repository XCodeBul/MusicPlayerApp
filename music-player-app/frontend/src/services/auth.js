import { supabase } from "../supabaseClient.js";

// Google Login (вече го имаш)
export const googleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin,
        },
    })
    if (error) console.error("Google Auth Error:", error.message)
}

// Вход с имейл и парола
export const emailLogin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error; // Хвърляме грешката, за да я хванем в UI-а
    return data.user;
};

// Регистрация с имейл и парола
export const emailRegister = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    return data.user;
};

// Изход (Logout)
export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout Error:", error.message);
};
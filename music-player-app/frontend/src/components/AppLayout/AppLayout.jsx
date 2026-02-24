import Navbar from "../Navbar.jsx";
import {useEffect, useRef, useState} from "react";
import {translations} from "../../locales/translations.js";
import {supabase} from "../../supabaseClient.js";
import {Outlet} from "react-router-dom";

const AppLayout = () => {
    const searchPanelRef = useRef(null);
    const musicAudioRef = useRef(null);
    const [user, setUser] = useState(null);
    const [language, setLanguage] = useState(localStorage.getItem('appLanguage') || 'BG');
    const t = translations[language];


    useEffect(() => {
        const syncToken = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/token");
                if (!res.ok) throw new Error("Server error " + res.status);
                const data = await res.json();
                if (data.access_token) {
                    localStorage.setItem("spotify_access_token", data.access_token);
                    console.log("✅ Spotify Token Synced Successfully!");
                }
            } catch (err) {
                console.error("❌ Token sync error:", err);
            }
        };
        syncToken();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        } else {

            setUser(null);


            if (musicAudioRef.current) {
                musicAudioRef.current.pause();
                musicAudioRef.current.src = "";
                musicAudioRef.current.load();

            }
            console.log("UI Cleaned");
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {

            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                updateUserInfo(session.user);
                // fetchUserPlaylists(session.user.id);
            }
        };

        const updateUserInfo = (supabaseUser) => {
            setUser({
                id: supabaseUser.id,
                name: supabaseUser.user_metadata?.full_name || "User",
                email: supabaseUser.email,
                avatar: supabaseUser.user_metadata?.avatar_url,
            });
        };

        // const fetchUserPlaylists = async (userId) => {
        //     const { data, error } = await supabase
        //         .from('playlists')
        //         .select('*')
        //         .eq('user_id', userId)
        //         .order('created_at', { ascending: true });
        //     if (data) setPlaylists(data);
        //     if (error) console.error("Playlist fetch error:", error);
        // };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Supabase Auth Event:", event);

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session) {
                    updateUserInfo(session.user);
                    // fetchUserPlaylists(session.user.id);
                    // setIsAuthOpen(false);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);


    return (
        <>
            <div
                className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden font-sans">
                <Navbar
                    t={t}
                    searchPanelRef={searchPanelRef}
                    user={user}
                    onLogout={handleLogout}
                    language={language}
                    setLanguage={setLanguage}
                />

                <Outlet/>
            </div>
        </>
    )
}

export default AppLayout

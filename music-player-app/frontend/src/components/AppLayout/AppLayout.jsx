import Navbar from "../Navbar.jsx";
import {useEffect} from "react";
import {supabase} from "../../supabaseClient.js";
import {Outlet} from "react-router-dom";
import {getSpotifyToken} from "../../services/spotify.js";
import {useAuthUserContext} from "../../contexts/AuthUserContext.jsx";
import {usePlaylistContext} from "../../contexts/PlaylistContext.jsx";

const AppLayout = () => {
    const {user, setAuthUser} = useAuthUserContext()
    const {setPlaylists} = usePlaylistContext()

    useEffect(() => {
        getSpotifyToken().then(data => {
            if (data.access_token) {
                localStorage.setItem("spotify_access_token", data.access_token)
                console.log("Spotify Token Synced Successfully!") // TODO: remove
            }
        })
    }, [])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error("Logout error:", error.message)
        } else {
            setPlaylists([])
            setAuthUser(null)
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
            setAuthUser({
                id: supabaseUser.id,
                name: supabaseUser.user_metadata?.full_name || "User",
                email: supabaseUser.email,
                avatar: supabaseUser.user_metadata?.avatar_url,
            });
        };

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
                setAuthUser(null)
            }
        });

        return () => subscription.unsubscribe();
    }, []);


    return (
        <>
            <div
                className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden font-sans">
                <Navbar
                    user={user}
                    onLogout={handleLogout}
                />

                <Outlet/>
            </div>
        </>
    )
}

export default AppLayout

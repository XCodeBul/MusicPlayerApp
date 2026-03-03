import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom"; 
import { supabase } from "../../supabaseClient.js";
import { useAuthUserContext } from "../../contexts/AuthUserContext.jsx";
import Navbar from "./Navbar/Navbar.jsx";
import Footer from "./Footer/Footer.jsx";

const AppLayout = () => {
    const { user, setAuthUser } = useAuthUserContext();
    const navigate = useNavigate(); 

    useEffect(() => {
        if (!user) {
            initializeAuth();
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session) {
                    const userData = {
                        id: session.user.id,
                        name: session.user.user_metadata?.full_name || "User",
                        email: session.user.email,
                        avatar: session.user.user_metadata?.avatar_url,
                    };
                    setAuthUser(userData);

               
                    navigate('/player'); 
                }
            } else if (event === 'SIGNED_OUT') {
                setAuthUser(null);
                navigate('/'); 
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate, setAuthUser]); 

    const initializeAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            updateUserInfo(session.user);
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

    return (
        <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden font-sans">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default AppLayout;
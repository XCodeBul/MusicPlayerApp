import {useEffect} from "react";
import {useNavigate, Outlet} from "react-router-dom";
import {supabase} from "../../supabaseClient.js";
import {useAuthUserContext} from "../../contexts/AuthUserContext.jsx";
import Navbar from "./Navbar/Navbar.jsx";
import Footer from "./Footer/Footer.jsx";
import {PATHS} from "../../config/paths.js";

const AppLayout = () => {
    const {user, setAuthUser} = useAuthUserContext();
    const navigate = useNavigate();

    useEffect(() => {
        // Проверяваме дали вече има вписан човек, когато страницата се зареди
        if (!user) {
            initializeAuth()
        }

        // Следим за промени: влизане, излизане или подновяване на достъпа
        const {data: {subscription}} = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session) {
                    // Когато потребителят е вътре, изваждаме данните му от сесията
                    const userData = {
                        id: session.user.id,
                        name: session.user.user_metadata?.full_name || "User",
                        email: session.user.email,
                        avatar: session.user.user_metadata?.avatar_url,
                    };
                    setAuthUser(userData)

                    // Автоматично го пращаме към плеъра
                    navigate(PATHS.player)
                }
            } else if (event === 'SIGNED_OUT') {
                // Ако излезе, изчистваме данните и го връщаме в началото
                setAuthUser(null)
                navigate(PATHS.home)
            }
        });

        // Спираме "слушалката", когато компонентът не се ползва
        return () => subscription.unsubscribe()
    }, [navigate, setAuthUser])

    // Функция, която проверява дали има запомнена активна сесия
    const initializeAuth = async () => {
        const {data: {session}} = await supabase.auth.getSession()
        if (session) {
            updateUserInfo(session.user)
        }
    }

    // Функция, която подготвя и записва данните на потребителя
    const updateUserInfo = (supabaseUser) => {
        setAuthUser({
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.full_name || "User",
            email: supabaseUser.email,
            avatar: supabaseUser.user_metadata?.avatar_url,
        });
    };

    return (
        <div
            className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden font-sans">
            <Navbar/>
            {/* Тук се зареждат различните страници под навигацията */}
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default AppLayout;
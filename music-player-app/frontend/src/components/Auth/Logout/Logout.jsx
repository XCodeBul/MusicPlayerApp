import {supabase} from "../../../supabaseClient.js";
import {useAuthUserContext} from "../../../contexts/AuthUserContext.jsx";
import {usePlaylistContext} from "../../../contexts/PlaylistContext.jsx";
import {useLocalizationContext} from "../../../contexts/LocalizationContext.jsx";

const Logout = ({setShowDropdown}) => {
    const {t} = useLocalizationContext()
    const {setAuthUser} = useAuthUserContext()
    const {setPlaylists} = usePlaylistContext()

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error("Logout error:", error.message)
        } else {
            setPlaylists([])
            setAuthUser(null)
        }
    }

    return (
        <button
            onClick={() => {
                handleLogout()
                setShowDropdown(false)
            }}
            className="w-full group flex items-center gap-4 px-4 py-4 rounded-[1.8rem] text-gray-400
                hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 text-left"
        >
            <div className="w-10 h-10 rounded-xl bg-gray-800/40 flex items-center justify-center
                group-hover:bg-red-500/20 transition-colors border border-white/5"
            >
                <span className="text-lg group-hover:-translate-x-1 transition-transform">↪</span>
            </div>
            <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest">{t.logout}</p>
                <p className="text-[10px] text-gray-500">{t.endSession}</p>
            </div>
        </button>
    )
}

export default Logout

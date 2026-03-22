import {useRef, useEffect, useState} from "react";
import TrackSearch from "../TrackSearch/TrackSearch.jsx";
import Login from "../../Auth/Login/Login.jsx";
import {useLocalizationContext} from "../../../contexts/LocalizationContext.jsx";
import Logout from "../../Auth/Logout/Logout.jsx";
import {useAuthUserContext} from "../../../contexts/AuthUserContext.jsx";
import { useLocation } from "react-router-dom";
import {PATHS} from "../../../config/paths.js";

export default function Navbar() {
    const {user} = useAuthUserContext()
    const [showDropdown, setShowDropdown] = useState(false)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [searchQuery, setSearchQuery] = useState("") 
    const [isAuthOpen, setIsAuthOpen] = useState(false)
    const dropdownRef = useRef(null)
    const inputRef = useRef(null)
    const location = useLocation();
    const isHomePage = location.pathname === PATHS.home;

    const {t, language, changeLanguage} = useLocalizationContext()

    useEffect(() => {
        const handleClickOutside = (e) => {
            const inputEl = inputRef.current
            if (inputEl && inputEl.contains(e.target)) return
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
    
            if (inputEl && !inputEl.contains(e.target)) {
                setIsSearchFocused(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <>
            <nav className="w-full bg-black/20 backdrop-blur-xl px-4 lg:px-8 py-4 flex items-center justify-between
                sticky top-0 z-50 border-b border-purple-500/10 shadow-2xl">
                
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center
                        shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:rotate-12 transition-transform duration-300
                        border border-purple-400/30 mr-2 md:mr-0">
                        <span className="text-white text-2xl">♪</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="hidden md:inline text-2xl font-black tracking-tighter bg-gradient-to-r
                            from-white via-purple-200 to-purple-400 bg-clip-text text-transparent italic uppercase
                            leading-none">
                          MusicNote
                        </span>
                        <span className="hidden md:inline text-[10px] font-bold text-purple-400/60 uppercase
                            tracking-[0.2em] mt-1 leading-none">
                            {t.slogan}
                        </span>
                    </div>
                </div>

                {!isHomePage && (
                    <div className={`flex items-center gap-6 lg:gap-8 transition-all duration-500`}>
                        <div className="relative group" ref={inputRef}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.searchPlaceholder}
                                onFocus={() => setIsSearchFocused(true)}
                                className={`w-[200px] bg-white/5 border border-purple-500/10 text-white rounded-2xl px-6
                            py-3 pr-12 text-sm outline-none transition-all duration-500 placeholder-gray-600
                            font-medium
                                ${isSearchFocused
                                    ? "bg-purple-900/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] lg:w-[500px]"
                                    : "hover:bg-white/10 lg:w-[450px]"
                                }
                            `}
                            />
                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors 
                            duration-300 ${isSearchFocused ? 'text-purple-400' : 'text-gray-500'}`}>
                                {searchQuery ? (
                                    <button onClick={() => setSearchQuery("")} className="hover:text-white
                                transition-colors">✕</button>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-5">
                    <div className="relative" ref={dropdownRef}>
                        {user ? (
                            <>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-3 bg-purple-500/5 hover:bg-purple-500/10 p-1
                                    lg:pr-5 rounded-full border border-purple-500/20 transition-all group"
                                >
                                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center
                                            justify-center font-black text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]
                                            group-hover:scale-105 transition-transform duration-300 border
                                            border-purple-400/30">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="text-left hidden md:block">
                                        <p className="text-[9px] text-purple-400 font-black uppercase tracking-[0.2em]
                                            leading-none mb-1">PRO_DATA</p>
                                        <p className="text-sm font-black text-white leading-none uppercase
                                            tracking-tight">{user.name}</p>
                                    </div>
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-4 w-72 bg-gray-900/95 backdrop-blur-2xl
                                        rounded-[2.5rem] border border-purple-500/20
                                        shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in
                                        zoom-in-95 duration-300 z-[60]">
                                        <div className="p-6 bg-gradient-to-b from-purple-500/10 to-transparent border-b border-purple-500/10">
                                            <div className="flex items-center gap-4 mb-1">
                                                <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center
                                                    justify-center text-xl font-black text-white
                                                    shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400/30">
                                                    {user.name?.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-white truncate uppercase tracking-tight italic">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                                                        {t.premiumMember}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 space-y-2">
                                            <div className="w-full flex flex-col gap-2 px-4 py-3 rounded-[1.8rem] bg-purple-500/5 border border-purple-500/10">
                                                <p className="text-[9px] font-black text-purple-400/60 uppercase tracking-[0.2em] ml-1">
                                                    {language === 'EN' ? 'System Language' : 'Системен език'}
                                                </p>
                                                <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                                                    <button
                                                        onClick={() => changeLanguage('EN')}
                                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'EN' ? "bg-purple-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                                                    >EN</button>
                                                    <button
                                                        onClick={() => changeLanguage('BG')}
                                                        className={`flex-1 py-1.5 rounded-lg text-[10px] font-black transition-all ${language === 'BG' ? "bg-purple-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                                                    >BG</button>
                                                </div>
                                            </div>

                                            <button className="w-full group flex items-center gap-4 px-4 py-4 rounded-[1.8rem] text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 text-left">
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors border border-purple-500/10">
                                                    <span className="text-lg">✨</span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-black uppercase tracking-widest">{t.appearance}</p>
                                                    <p className="text-[10px] text-gray-500">{t.changeTheme}</p>
                                                </div>
                                                <span className="text-[9px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg font-black tracking-tighter">SOON</span>
                                            </button>
                                            
                                            <Logout setShowDropdown={setShowDropdown}/>
                                        </div>

                                        <div className="px-6 py-4 bg-purple-900/20 flex justify-between items-center border-t border-purple-500/10">
                                            <span className="text-[9px] font-bold text-purple-300/40 uppercase tracking-widest">MusicNote v1.0</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"/>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                {isHomePage && (
                                    <div className="flex flex-col gap-1.5 p-2 rounded-2xl border border-purple-500/10">
                                        <div className="flex p-1 rounded-xl w-24">
                                            <button
                                                onClick={() => changeLanguage('EN')}
                                                className={`flex-1 py-1 rounded-lg text-[9px] font-black transition-all 
                                                ${language === 'EN' ? "bg-purple-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                                            >
                                                EN
                                            </button>
                                            <button
                                                onClick={() => changeLanguage('BG')}
                                                className={`flex-1 py-1 rounded-lg text-[9px] font-black transition-all 
                                                ${language === 'BG' ? "bg-purple-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
                                            >
                                                BG
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <button
                                    onClick={() => setIsAuthOpen(true)}
                                    className="bg-transparent border border-purple-500/50 text-purple-400 font-black py-2.5 px-8 rounded-xl transition-all duration-300 hover:bg-purple-600 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-95 text-xs uppercase tracking-widest"
                                >
                                    {t.initLogin}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

         
            <div className={isHomePage ? "hidden" : "block"}>
                <TrackSearch 
                    isSearchFocused={isSearchFocused} 
                    setIsSearchFocused={setIsSearchFocused}
                     searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery}
                />
            </div>

            <Login isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </>
    )
}
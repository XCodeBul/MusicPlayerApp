import { useRef, useEffect, useState } from "react";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  searchPanelRef,
  onLoginClick,
  user, 
  onLogout
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close search AND dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Logic for search input
      const inputEl = inputRef.current;
      const panelEl = searchPanelRef?.current;
      if (inputEl && inputEl.contains(e.target)) return;
      if (panelEl && panelEl.contains(e.target)) return;
      setIsSearchFocused(false);

      // Logic for profile dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchFocused, setIsSearchFocused, searchPanelRef]);

  return (
    <nav className="w-full bg-gray-900/40 backdrop-blur-xl px-8 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-white/5 shadow-2xl">
      
      {/* LOGO */}
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
          <span className="text-white text-2xl">♪</span>
        </div>
        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-blue-200 to-gray-400 bg-clip-text text-transparent italic">
          MUSICNOTE
        </span>
      </div>

      <div className="flex items-center gap-8">
        {/* SEARCH BAR */}
        <div className="relative group" ref={inputRef}>
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchQuery("");
                setIsSearchFocused(false);
                inputRef.current?.blur();
              }
            }}
            className={`
              w-[450px] bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-3 pr-12 text-sm 
              outline-none transition-all duration-500 placeholder-gray-500
              ${isSearchFocused 
                ? "bg-gray-800/80 border-blue-500/50 ring-4 ring-blue-500/10 w-[500px]" 
                : "hover:bg-white/10"
              }
            `}
          />
          <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-blue-400' : 'text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* AUTH SECTION */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <>
              {/* USER PROFILE DISPLAY */}
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-1 pr-5 rounded-full border border-white/10 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter leading-none mb-1">PRO MEMBER</p>
                  <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                </div>
              </button>

              {/* DROPDOWN MENU */}
              {showDropdown && (
                <div className="absolute right-0 mt-4 w-72 bg-[#0d0d0d]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.7)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 z-[60]">
                  
                  {/* Header Section: User Info */}
                  <div className="p-6 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5">
                    <div className="flex items-center gap-4 mb-1">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xl font-black shadow-lg shadow-blue-500/20">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-white truncate uppercase tracking-tight italic">{user.name}</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Premium Member</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Section */}
                  <div className="p-3 space-y-2">
                    {/* Appearance Button */}
                    <button className="w-full group flex items-center gap-4 px-4 py-4 rounded-[1.5rem] text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 text-left">
                      <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                        <span className="text-lg">✨</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-widest">Appearance</p>
                        <p className="text-[10px] text-gray-500">Change Theme</p>
                      </div>
                      <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg font-black tracking-tighter">SOON</span>
                    </button>

                    {/* Logout Button */}
                    <button 
                      onClick={() => {
                        onLogout();
                        setShowDropdown(false);
                      }}
                      className="w-full group flex items-center gap-4 px-4 py-4 rounded-[1.5rem] text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <span className="text-lg group-hover:-translate-x-1 transition-transform">↪</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-widest">Logout</p>
                        <p className="text-[10px] text-gray-500">End session</p>
                      </div>
                    </button>
                  </div>

                  {/* Footer Info */}
                  <div className="px-6 py-4 bg-black/20 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">MusicNote v1.0</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button 
              onClick={onLoginClick} 
              className="relative overflow-hidden group bg-white text-black font-bold py-3 px-10 rounded-2xl transition-all duration-300 hover:pr-12 active:scale-95"
            >
              <span className="relative z-10">Login</span>
              <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                →
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
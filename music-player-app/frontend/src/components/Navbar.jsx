import { useRef, useEffect } from "react";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  searchPanelRef,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inputEl = inputRef.current;
      const panelEl = searchPanelRef?.current;
      if (inputEl && inputEl.contains(e.target)) return;
      if (panelEl && panelEl.contains(e.target)) return;
      setIsSearchFocused(false);
    };

    if (isSearchFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchFocused, setIsSearchFocused, searchPanelRef]);

  return (
    <nav className="w-full bg-gray-900/40 backdrop-blur-xl px-8 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-white/5 shadow-2xl">
     
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
          <span className="text-white text-2xl">♪</span>
        </div>
        <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white via-blue-200 to-gray-400 bg-clip-text text-transparent italic">
          MUSICNOTE
        </span>
      </div>

      
      <div className="flex items-center gap-8">
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

        <button className="relative overflow-hidden group bg-white text-black font-bold py-3 px-10 rounded-2xl transition-all duration-300 hover:pr-12 active:scale-95">
          <span className="relative z-10">Login</span>
          <span className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            →
          </span>
        </button>
      </div>
    </nav>
  );
}
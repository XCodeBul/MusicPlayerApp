// components/Navbar.jsx — updated to respect clicks inside the search panel
import { useRef, useEffect } from "react";

export default function Navbar({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  searchPanelRef, // new prop: ref to search results panel
}) {
  const inputRef = useRef(null);

  // Close search when clicking outside the input AND outside the search panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inputEl = inputRef.current;
      const panelEl = searchPanelRef?.current;

      // if click is inside input => keep open
      if (inputEl && inputEl.contains(e.target)) return;
      // if panel exists and click is inside panel => keep open
      if (panelEl && panelEl.contains(e.target)) return;

      // otherwise close
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
    <nav className="w-full bg-gray-800/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-xl border-b border-gray-700">
      <div className="flex items-center gap-3">
        <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Music Note</span>
      </div>

      <div className="flex items-center gap-6">
        {/* SEARCH BAR — CLICK TO ACTIVATE */}
        <div className="relative" ref={inputRef}>
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
            className="w-96 bg-gray-700/80 backdrop-blur-md text-white rounded-full px-6 py-3 pr-12 text-base outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 placeholder-gray-400"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105">
          Login
        </button>
      </div>
    </nav>
  );
}

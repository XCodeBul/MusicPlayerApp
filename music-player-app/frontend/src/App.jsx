// src/App.jsx
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import Sidebar from "./components/Sidebar";
import "./index.css";

export default function App() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchPanelRef = useRef(null);

  const handleUpdatePlaylistCover = (playlistId, newCover) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, cover: newCover } : p))
    );
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist((prev) => ({ ...prev, cover: newCover }));
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const filteredResults = (data.tracks?.items || []).filter(
          (track) => track.preview_url !== null
        );
        setSearchResults(filteredResults);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
      setSearchLoading(false);
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  const formatDuration = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleCreatePlaylist = (name) => {
    const newPlaylist = { id: Date.now(), name, cover: null, songs: [] };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const handleAddToPlaylist = (track, playlistId) => {
    if (!track.preview_url) {
      alert(`"${track.name}" by ${track.artists[0].name} has no preview available`);
      return;
    }

    const newSong = {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      duration: "30s",
      albumArt: track.album.images[1]?.url || track.album.images[0]?.url || null,
      src: track.preview_url,
    };

    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId ? { ...p, songs: [...p.songs, newSong] } : p
      )
    );

    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist((prev) => ({
        ...prev,
        songs: [...prev.songs, newSong],
      }));
    }

    setShowPlaylistPicker(null);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleNext = () => {
    if (!selectedPlaylist) return;
    const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id);
    const next = selectedPlaylist.songs[(idx + 1) % selectedPlaylist.songs.length];
    playSong(next);
  };
  const handlePrev = () => {
    if (!selectedPlaylist) return;
    const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id);
    const prev =
      selectedPlaylist.songs[
        (idx - 1 + selectedPlaylist.songs.length) % selectedPlaylist.songs.length
      ];
    playSong(prev);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        searchPanelRef={searchPanelRef}
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-24 bg-gray-900 rounded-3xl flex flex-col shadow-xl ml-4 my-4 flex-shrink-0">
          <Sidebar
            playlists={playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onUpdatePlaylistCover={handleUpdatePlaylistCover}
            onSelectPlaylist={setSelectedPlaylist}
          />
        </aside>

        <div className="flex-1 flex flex-col px-4 pt-4 gap-3 overflow-y-auto">
          <div className="flex-shrink-0">
            <div className="scale-90 origin-top-left">
              <MusicPlayer
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrev={handlePrev}
                progress={progress}
                onSeek={(newProgress) => setProgress(newProgress)}
                
              />
            </div>
          </div>

          {/* NEW PREMIUM SEARCH PANEL – CLEAN, MODERN, PERFECT */}
{isSearchFocused && (
  <>
    {/* Invisible backdrop – closes when clicking outside */}
    <div
      className="fixed inset-0 z-[999998]"
      onClick={() => setIsSearchFocused(false)}
    />

    {/* MAIN SEARCH DROPDOWN */}
    <div
      ref={searchPanelRef}
      onClick={(e) => e.stopPropagation()}
      className="fixed left-1/2 top-28 -translate-x-1/2 w-full max-w-2xl 
                 bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl 
                 border border-gray-700/50 overflow-hidden
                 z-[999999] animate-in slide-in-from-top-4 duration-300"
    >
      {/* Top bar with search icon + input */}
      <div className="flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-gray-700/50">
        <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          autoFocus
          className="flex-1 bg-transparent text-white text-lg outline-none placeholder-gray-500"
        />

        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSearchResults([]);
            }}
            className="text-gray-500 hover:text-white transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results area */}
      <div className="max-h-96 overflow-y-auto">
        {searchLoading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="p-4 space-y-2">
            {searchResults.map((track) => (
              <div
                key={track.id}
                className="relative group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 
                           transition-all duration-200 cursor-default"
              >
                {/* Album Art */}
                {track.album.images[2]?.url ? (
                  <img
                    src={track.album.images[2].url}
                    alt=""
                    className="w-14 h-14 rounded-xl shadow-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    🎵
                  </div>
                )}

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{track.name}</p>
                  <p className="text-sm text-gray-400 truncate">
                    {track.artists.map(a => a.name).join(", ")}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-sm text-gray-500 px-3">
                  {formatDuration(track.duration_ms)}
                </span>

                {/* ADD BUTTON */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPlaylistPicker(track.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 
                             hover:from-green-400 hover:to-emerald-400 rounded-full flex items-center justify-center
                             text-2xl font-bold shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                  +
                </button>

                {/* PLAYLIST PICKER – ALWAYS ON TOP */}
                {showPlaylistPicker === track.id && playlists.length > 0 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-8 top-20 bg-gray-800/98 backdrop-blur-xl rounded-2xl 
                               shadow-2xl border border-gray-600 z-[9999999] min-w-56 py-2"
                  >
                    <p className="px-6 py-2 text-xs uppercase tracking-wider text-gray-500 font-medium">
                      Add to playlist
                    </p>

                    {playlists.map((p) => (
                      <div
                        key={p.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToPlaylist(track, p.id);
                        }}
                        className="px-6 py-3 hover:bg-gray-700/70 cursor-pointer text-sm 
                                   flex items-center gap-3 transition"
                      >
                        {p.cover ? (
                          <img src={p.cover} className="w-8 h-8 rounded" alt="" />
                        ) : (
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
                            🎵
                          </div>
                        )}
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <div className="py-20 text-center text-gray-500">
            <p className="text-xl">No results found</p>
            <p className="mt-2">Try searching for something else</p>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            <p className="text-xl">Start typing to search songs</p>
          </div>
        )}
      </div>
    </div>
  </>
)}


         <div className="flex-1 w-full max-w-2xl bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 -mt-8 mb-4 overflow-y-auto border border-gray-700/50 shadow-2xl">
            <h3 className="font-bold text-xl mb-4">
              {selectedPlaylist ? selectedPlaylist.name : "Your Queue"}
            </h3>

            {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
              <ul className="space-y-3">
                {selectedPlaylist.songs.map((song) => (
                  <li
                    key={song.id}
                    onClick={() => playSong(song)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                      currentSong?.id === song.id
                        ? "bg-gradient-to-r from-blue-600/30 to-purple-600/30 ring-2 ring-blue-500"
                        : "bg-gray-700/50 hover:bg-gray-600/70"
                    }`}
                  >
                    {song.albumArt ? (
                      <img src={song.albumArt} className="w-12 h-12 rounded-lg" alt="" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                        🎵
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{song.title}</p>
                      <p className="text-sm text-gray-400">{song.artist}</p>
                    </div>
                    <span className="text-sm text-green-400">30s</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 mt-20 text-lg">
                {selectedPlaylist ? "This playlist is empty" : "Select a playlist to start"}
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-800/50 backdrop-blur text-center py-3 text-gray-400 text-sm border-t border-gray-700">
        © 2025 Music Note — Built with love and magic
      </footer>
    </div>
  );
}

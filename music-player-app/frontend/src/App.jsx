// src/App.jsx
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import Sidebar from "./components/Sidebar";
import Visualizer from "./components/Visualizer";
import ArtistInfo from "./components/ArtistInfo";
import Lyrics from "./components/Lyrics"; 
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
  const musicAudioRef = useRef(null);

  // Коригиране на корицата на плейлиста
  const handleUpdatePlaylistCover = (playlistId, newCover) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, cover: newCover } : p))
    );
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist((prev) => ({ ...prev, cover: newCover }));
    }
  };

  // Търсене на песни (Spotify API / Local Backend)
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


  // Вътре в App.jsx
useEffect(() => {
  const syncToken = async () => {
    try {
      // Вече ще работи, защото добавихме маршрута в бекенда
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
      artistId: track.artists[0].id,
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
    if (!selectedPlaylist || selectedPlaylist.songs.length === 0) return;
    const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id);
    const next = selectedPlaylist.songs[(idx + 1) % selectedPlaylist.songs.length];
    playSong(next);
  };

  const handlePrev = () => {
    if (!selectedPlaylist || selectedPlaylist.songs.length === 0) return;
    const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id);
    const prev = selectedPlaylist.songs[(idx - 1 + selectedPlaylist.songs.length) % selectedPlaylist.songs.length];
    playSong(prev);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden font-sans">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        searchPanelRef={searchPanelRef}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-24 bg-gray-900 rounded-3xl flex flex-col shadow-xl ml-4 my-4 flex-shrink-0">
          <Sidebar
            playlists={playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onUpdatePlaylistCover={handleUpdatePlaylistCover}
            onSelectPlaylist={setSelectedPlaylist}
          />
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
          
{/* HEADER SECTION: PLAYER & ARTIST INFO */}
{/* HEADER SECTION: PLAYER & ARTIST INFO */}
{/* HEADER SECTION: PLAYER & ARTIST INFO */}
<div className="flex flex-row items-stretch flex-shrink-0 w-full overflow-hidden">
  
  {/* 1. MUSIC PLAYER WRAPPER - Фиксиран размер */}
  <div className="scale-90 origin-top-left shrink-0">
    <MusicPlayer
      ref={musicAudioRef}
      currentSong={currentSong}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onNext={handleNext}
      onPrev={handlePrev}
      progress={progress}
      onSeek={(newProgress) => setProgress(newProgress)}
    />
  </div>

  {/* 2. ARTIST INFO WRAPPER - Динамичен (разтяга се надясно) */}
  <div className="flex-1 -ml-6 py-[1.9%] -mt-9 flex flex-col transition-all duration-300 min-w-0 "> 
    <div className="bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl flex-1 flex flex-col justify-center overflow-hidden">
      
      {currentSong ? (
        <ArtistInfo currentSong={currentSong} />
      ) : (
        <div className="flex-1 flex flex-row items-center justify-center text-center gap-6">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center text-3xl shadow-inner shrink-0">
            👤
          </div>
          <div className="text-left">
            <h3 className="text-gray-400 font-semibold text-lg">Artist Details</h3>
            <p className="text-gray-500 text-sm">Select a track to view full biography and stats</p>
          </div>
        </div>
      )}
      
    </div>
  </div>

</div> 
{/* ^ THIS IS THE CLOSING TAG FOR THE HEADER SECTION ROW */}

          {/* LOWER SECTION: QUEUE & VISUALIZER */}
          {/* LOWER SECTION: QUEUE & VISUALIZER & LYRICS */}
<div className="flex-1 flex flex-col -mt-4 mb-4 overflow-hidden">
  <div className="flex-1 flex gap-5 overflow-hidden">
    
    {/* QUEUE / PLAYLIST LIST (НЕПРОМЕНЕН) */}
    <div className="w-full max-w-2xl flex-1 bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl overflow-y-auto custom-scrollbar">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <span className="text-purple-500">#</span>
        {selectedPlaylist ? selectedPlaylist.name : "Your Queue"}
      </h3>

      {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
        <ul className="space-y-4">
          {selectedPlaylist.songs.map((song) => (
            <li
              key={song.id}
              onClick={() => playSong(song)}
              className={`flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-300 group ${
                currentSong?.id === song.id
                  ? "bg-gradient-to-r from-purple-600/40 to-blue-600/40 ring-2 ring-purple-500 shadow-xl"
                  : "bg-gray-700/50 hover:bg-gray-600/70"
              }`}
            >
              {song.albumArt ? (
                <img src={song.albumArt} className="w-14 h-14 rounded-xl shadow-lg" alt="" />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  🎵
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-lg group-hover:text-purple-300 transition-colors">{song.title}</p>
                <p className="text-gray-400">{song.artist}</p>
              </div>
              <span className="text-sm text-green-400 font-medium">30s</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-24 text-gray-500">
          <div className="text-5xl mb-4">🎶</div>
          <p className="text-xl font-medium">Your queue is empty</p>
          <p className="mt-2">Use the search bar to find and add tracks</p>
        </div>
      )}
    </div>

    {/* VISUALIZER SECTION (НЕПРОМЕНЕН) */}
    <div className="w-[400px] flex-shrink-0 bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl flex items-center justify-center overflow-hidden">
      <Visualizer audioRef={musicAudioRef} currentSong={currentSong} />
    </div>

    {/* LYRICS SECTION (ДОБАВЕНА В ПРАЗНОТО МЯСТО) */}
    <div className="flex-1 min-w-[300px] flex flex-col overflow-hidden">
      <Lyrics currentSong={currentSong} />
    </div>

  </div>
</div>
        </div>
      </div>

      {/* SEARCH PANEL OVERLAY */}
      {isSearchFocused && (
        <>
          <div
            className="fixed inset-0 z-[999998] bg-black/20 backdrop-blur-sm"
            onClick={() => setIsSearchFocused(false)}
          />
          <div
            ref={searchPanelRef}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-28 -translate-x-1/2 w-full max-w-2xl 
                       bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl 
                       border border-gray-700/50 overflow-hidden
                       z-[999999] animate-in slide-in-from-top-4 duration-300"
          >
            <div className="flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-gray-700/50">
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

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {searchLoading ? (
                <div className="py-20 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                  <p className="mt-4 text-gray-400">Searching Spotify...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-4 space-y-2">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="relative group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-200 cursor-default"
                    >
                      {track.album.images[2]?.url ? (
                        <img src={track.album.images[2].url} alt="" className="w-14 h-14 rounded-xl shadow-lg flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                          🎵
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{track.name}</p>
                        <p className="text-sm text-gray-400 truncate">{track.artists.map(a => a.name).join(", ")}</p>
                      </div>
                      <span className="text-sm text-gray-500 px-3">{formatDuration(track.duration_ms)}</span>
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
                      
                      {showPlaylistPicker === track.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-12 top-16 bg-gray-800/98 backdrop-blur-xl rounded-2xl 
                                     shadow-2xl border border-gray-600 z-[9999999] min-w-[200px] py-2 overflow-hidden"
                        >
                          <p className="px-6 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">
                            Add to playlist
                          </p>
                          {playlists.length > 0 ? (
                            playlists.map((p) => (
                              <div
                                key={p.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToPlaylist(track, p.id);
                                }}
                                className="px-6 py-3 hover:bg-purple-600/20 cursor-pointer text-sm 
                                           flex items-center gap-3 transition"
                              >
                                {p.cover ? <img src={p.cover} className="w-8 h-8 rounded" alt="" /> : <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-[10px]">PL</div>}
                                <span className="truncate">{p.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="px-6 py-3 text-sm text-gray-400 italic">No playlists found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="py-20 text-center text-gray-500">
                  <p className="text-xl">No results found</p>
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

      {/* FOOTER */}
      <footer className="bg-gray-800/50 backdrop-blur text-center py-3 text-gray-400 text-sm border-t border-gray-700 flex-shrink-0">
        © 2025 Music Note — Built with love and magic
      </footer>
    </div>
  );
}
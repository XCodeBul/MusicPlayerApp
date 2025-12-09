// src/App.jsx
import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import Sidebar from "./components/Sidebar";
import Visualizer from "./components/Visualizer";
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
      {/* NAVBAR */}
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

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
          {/* MUSIC PLAYER */}
          <div className="flex-shrink-0 scale-90 origin-top-left">
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

          {/* SCROLLABLE CONTENT */}
          <div className="flex-1 flex flex-col -mt-6 mb-4 overflow-hidden">
            {/* QUEUE + VISUALIZER FLEXIBLE */}
            <div className="flex-1 flex gap-5 overflow-hidden">
              {/* QUEUE */}
              <div className="w-full max-w-2xl flex-1 bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl overflow-y-auto">
                <h3 className="text-2xl font-bold mb-6">
                  {selectedPlaylist ? selectedPlaylist.name : "Your Queue"}
                </h3>

                {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
                  <ul className="space-y-4">
                    {selectedPlaylist.songs.map((song) => (
                      <li
                        key={song.id}
                        onClick={() => playSong(song)}
                        className={`flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                          currentSong?.id === song.id
                            ? "bg-gradient-to-r from-purple-600/40 to-blue-600/40 ring-2 ring-purple-500 shadow-xl"
                            : "bg-gray-700/50 hover:bg-gray-600/70"
                        }`}
                      >
                        {song.albumArt ? (
                          <img src={song.albumArt} className="w-14 h-14 rounded-xl shadow-lg" alt="" />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                            Music Note
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{song.title}</p>
                          <p className="text-gray-400">{song.artist}</p>
                        </div>
                        <span className="text-sm text-green-400 font-medium">30s</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">Your queue is empty</p>
                    <p className="mt-2">Add songs to start listening</p>
                  </div>
                )}
              </div>

              {/* VISUALIZER */}
              <div className="w-80 flex-shrink-0 bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 shadow-2xl flex items-center justify-center">
                <Visualizer audioRef={musicAudioRef} currentSong={currentSong} />
              </div>
            </div>

            {/* SEARCH PANEL */}
            {isSearchFocused && (
              <>
                <div
                  className="fixed inset-0 z-[999998]"
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
                  {/* SEARCH INPUT */}
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

                  {/* SEARCH RESULTS */}
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
                            className="relative group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-200 cursor-default"
                          >
                            {track.album.images[2]?.url ? (
                              <img src={track.album.images[2].url} alt="" className="w-14 h-14 rounded-xl shadow-lg flex-shrink-0" />
                            ) : (
                              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
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
                                    {p.cover ? <img src={p.cover} className="w-8 h-8 rounded" alt="" /> : <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">🎵</div>}
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
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800/50 backdrop-blur text-center py-3 text-gray-400 text-sm border-t border-gray-700 flex-shrink-0">
        © 2025 Music Note — Built with love and magic
      </footer>
    </div>
  );
}

// App.jsx
import { useState, useEffect } from "react";
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

  // Player state
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`, { signal: controller.signal });
        const data = await res.json();
        setSearchResults(data.tracks?.items || []);
      } catch (err) { if (err.name !== "AbortError") console.error(err); }
      setSearchLoading(false);
    }, 400);
    return () => { clearTimeout(timeout); controller.abort(); };
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

  const handleUpdatePlaylistCover = (id, coverUrl) => {
    setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, cover: coverUrl } : p)));
  };

  const handleAddToPlaylist = (track, playlistId) => {
   const newSong = {
  id: track.id,
  title: track.name,
  artist: track.artists[0].name,
  duration: formatDuration(track.duration_ms),
  albumArt: track.album.images[1]?.url || track.album.images[0]?.url || null,
  src: track.preview_url, // ← REQUIRED FOR AUDIO
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

  // Player controls
  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
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
    const prev = selectedPlaylist.songs[(idx - 1 + selectedPlaylist.songs.length) % selectedPlaylist.songs.length];
    playSong(prev);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-24 bg-gray-800 rounded-3xl flex flex-col items-center py-6 shadow-xl ml-0 mx-0 my-4">
          <Sidebar
            playlists={playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onUpdatePlaylistCover={handleUpdatePlaylistCover}
            onSelectPlaylist={setSelectedPlaylist}
          />
        </aside>

        <div className="flex-1 flex flex-col px-4 pt-4 gap-3 overflow-y-auto">
          {/* Player */}
          <div className="flex-shrink-0">
            <div className="scale-90 origin-top-left">
              <MusicPlayer
                currentSong={currentSong}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrev={handlePrev}
                progress={progress}
                onSeek={setProgress}
              />
            </div>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="fixed inset-x-0 top-20 left-32 right-8 mx-auto max-w-2xl bg-gray-800 rounded-xl p-4 shadow-xl z-40 max-h-64 overflow-y-auto">
              {searchLoading ? (
                <p className="text-gray-400 text-center">Loading...</p>
              ) : searchResults.length > 0 ? (
                <ul className="space-y-2">
                  {searchResults.map((track) => (
                    <li key={track.id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition relative">
                      <div className="flex items-center gap-3 flex-1">
                        {track.album.images[2]?.url && (
                          <img src={track.album.images[2].url} alt={track.name} className="w-10 h-10 rounded" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{track.name}</p>
                          <p className="text-xs text-gray-400 truncate">{track.artists[0].name}</p>
                        </div>
                        <span className="text-xs text-gray-400">{formatDuration(track.duration_ms)}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowPlaylistPicker(track.id); }}
                        className="ml-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        +
                      </button>
                      {showPlaylistPicker === track.id && playlists.length > 0 && (
                        <div className="absolute right-0 top-10 bg-gray-700 rounded-lg shadow-xl z-50 min-w-48">
                          <ul className="py-1">
                            {playlists.map((p) => (
                              <li
                                key={p.id}
                                onClick={() => handleAddToPlaylist(track, p.id)}
                                className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-sm"
                              >
                                {p.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center">No results</p>
              )}
            </div>
          )}

          {/* Queue */}
          <div className="flex-1 w-full max-w-2xl bg-gray-800 rounded-xl p-4 -mt-10 mb-4 overflow-y-auto">
            <h3 className="font-semibold text-lg mb-3">
              {selectedPlaylist ? selectedPlaylist.name : "Queue"}
            </h3>
            {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
              <ul className="space-y-2">
                {selectedPlaylist.songs.map((song) => (
                  <li
                    key={song.id}
                    onClick={() => playSong(song)}
                    className={`flex items-center gap-3 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition ${
                      currentSong?.id === song.id ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    {song.albumArt && <img src={song.albumArt} alt="" className="w-10 h-10 rounded" />}
                    <div className="flex-1">
                      <p className="text-sm truncate">{song.title}</p>
                      {song.artist && <p className="text-xs text-gray-400">{song.artist}</p>}
                    </div>
                    <span className="text-xs text-gray-400">{song.duration}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic text-center mt-8">
                {selectedPlaylist ? "No songs in this playlist" : "Select a playlist"}
              </p>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-center py-2 text-gray-400 text-xs">
        © 2025 My Music Player
      </footer>
    </div>
  );
}
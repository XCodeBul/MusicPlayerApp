// App.jsx
import { useState } from "react";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import Sidebar from "./components/Sidebar";
import "./index.css";

export default function App() {
  const [playlists, setPlaylists] = useState([]);

  // FIXED: Moved OUTSIDE handleCreatePlaylist
  const handleCreatePlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      cover: null,
      songs: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  // FIXED: Defined at the same level as handleCreatePlaylist
  const handleUpdatePlaylistCover = (id, coverUrl) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cover: coverUrl } : p))
    );
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-24 bg-gray-800 rounded-3xl flex flex-col items-center py-6 shadow-xl ml-0 mx-0 my-4">
          <Sidebar
            playlists={playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onUpdatePlaylistCover={handleUpdatePlaylistCover}
          />
        </aside>

        {/* Center: Player + Queue */}
        <div className="flex-1 flex flex-col items-start px-4 pt-4 gap-0">
          {/* Music Player */}
          <div className="mb-1">
            <div className="scale-90 origin-top-left">
              <MusicPlayer />
            </div>
          </div>

          {/* Queue */}
          <div className="w-full max-w-xl bg-gray-800 rounded-xl p-4 flex-1 min-h-0 -mt-10 mb-4 ">
            <h3 className="font-semibold text-lg mb-2">Playlist Songs</h3>
            <div className="text-sm text-gray-500 italic">
              (Songs will appear here)
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-2 text-gray-400 text-xs">
        © 2025 My Music Player
      </footer>
    </div>
  );
}
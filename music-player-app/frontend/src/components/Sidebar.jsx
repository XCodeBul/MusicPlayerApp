// components/Sidebar.jsx
import { useState } from "react";

export default function Sidebar({ playlists, onCreatePlaylist, onUpdatePlaylistCover }) {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");

  const handleCreate = () => {
    if (input.trim()) {
      onCreatePlaylist(input.trim());
      setInput("");
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="h-screen w-24 bg-gray-900 border-r border-gray-800 rounded-r-3xl flex flex-col items-center py-6 gap-5 shadow-lg">
        {/* + Create Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white text-3xl font-bold rounded-2xl flex items-center justify-center shadow-md transition-all duration-200"
          title="Create new playlist"
        >
          +
        </button>

        {/* Playlists */}
        <div className="flex flex-col items-center gap-4 mt-4 overflow-y-auto flex-1 pb-4">
          {playlists.length === 0 ? (
            <p className="text-gray-500 text-xs text-center w-16">No playlists</p>
          ) : (
            playlists.map((playlist) => (
              <div key={playlist.id} className="relative group">
                {/* Cover Image */}
                <div className="relative">
                  <img
                    src={playlist.cover || "https://via.placeholder.com/56/1a1a1a/ffffff?text=♪"}
                    alt={playlist.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-md transition hover:opacity-90"
                  />

                  {/* Pencil – top-right, only on hover */}
                  <label
                    htmlFor={`cover-${playlist.id}`}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </label>

                  {/* Hidden File Input */}
                  <input
                    id={`cover-${playlist.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && onUpdatePlaylistCover) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          onUpdatePlaylistCover(playlist.id, reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                {/* Name Tooltip – appears TO THE RIGHT on hover ONLY */}
                <div
                  className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                >
                  <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                    {playlist.name}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-80 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4">New Playlist</h3>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Playlist name..."
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
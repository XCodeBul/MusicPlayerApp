// components/Sidebar.jsx — COVER UPLOAD 100% WORKING + PENCIL IN CORNER
import { useState } from "react";

export default function Sidebar({ playlists, onCreatePlaylist, onUpdatePlaylistCover, onSelectPlaylist }) {
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState("");
  const [tooltip, setTooltip] = useState(null);

  const handleCreate = () => {
    if (input.trim()) {
      onCreatePlaylist(input.trim());
      setInput("");
      setShowModal(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
  {/* + Button */}
  <div className="flex flex-col items-center py-6 flex-shrink-0">
    <button
      onClick={() => setShowModal(true)}
      className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-4xl font-bold rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
      title="Create new playlist"
    >
      +
    </button>
  </div>

      {/* Scrollable Playlists */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900">
        <div className="flex flex-col items-center gap-5 py-3">
          {playlists.length === 0 ? (
            <p className="text-gray-500 text-xs italic mt-12">No playlists yet</p>
          ) : (
            playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="relative group cursor-pointer"
                onClick={() => onSelectPlaylist?.(playlist)}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    name: playlist.name,
                    x: rect.right + 16,
                    y: rect.top + rect.height / 2,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                {/* Playlist Cover */}
                <div className="relative">
                  <img
                    src={playlist.cover || "https://pixsector.com/cache/8955ccde/avea0c6d1234636825bd6.png"}
                    alt={playlist.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-lg ring-2 ring-gray-800 group-hover:ring-blue-500 transition-all duration-300"
                  />

                  {/* PENCIL ICON — TOP-RIGHT CORNER */}
                  <label
  htmlFor={`cover-${playlist.id}`}
  onClick={(e) => e.stopPropagation()}
  className="absolute top-1 right-1 w-6 h-6 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer z-20 shadow-lg"
>

                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </label>

                  {/* FIXED FILE INPUT — NOW 100% WORKING */}
                  <input
                    id={`cover-${playlist.id}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = reader.result;
                        if (typeof result === "string") {
                          onUpdatePlaylistCover(playlist.id, result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-[999999] pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateY(-50%)",
          }}
        >
          <div className="relative">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold text-sm px-6 py-3.5 rounded-2xl shadow-2xl border border-gray-700 whitespace-nowrap backdrop-blur-xl">
              {tooltip.name}
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-0 h-0 border-8 border-transparent border-r-gray-800"></div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999999]">
          <div className="bg-gray-800 rounded-2xl p-8 w-96 shadow-3xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Create New Playlist</h3>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Playlist name..."
              className="w-full bg-gray-700 text-white rounded-xl px-5 py-4 text-lg outline-none focus:ring-4 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-400 hover:text-white font-medium">Cancel</button>
              <button onClick={handleCreate} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-105">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

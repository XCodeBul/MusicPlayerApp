
import { useState } from "react";

export default function Sidebar({ 
  playlists, 
  onCreatePlaylist, 
  onUpdatePlaylistCover, 
  onSelectPlaylist,
  onDeletePlaylist 
}) {
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
    <div className="flex flex-col h-full relative border-r border-purple-500/10">
      
       
      <div className="flex flex-col items-center py-6 flex-shrink-0">
        <button
          onClick={() => setShowModal(true)}
          className="w-14 h-14 bg-transparent border-2 border-purple-500/40 text-purple-500 text-3xl font-light rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:border-purple-400 hover:text-purple-300 transition-all duration-500 transform hover:scale-105 active:scale-95"
          title="Create new playlist"
        >
          <span className="mb-1">+</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 custom-scrollbar">
        <div className="flex flex-col items-center gap-3 py-2">
          {playlists.map((playlist) => (
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
              <div className="relative">
                <img
                  src={playlist.cover || "https://pixsector.com/cache/8955ccde/avea0c6d1234636825bd6.png"}
                  alt={playlist.name}
                  className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/5 transition-all duration-500 group-hover:scale-110"
                />

              
                <div className="absolute inset-0 bg-purple-900/60 backdrop-blur-md rounded-2xl border border-purple-400/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
                  <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,0.5)_50%,transparent_75%)] bg-[length:4px_4px]" />

                  <button
                    onClick={(e) => { e.stopPropagation(); onDeletePlaylist(e, playlist.id); }}
                    className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors relative z-10"
                  >
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <label htmlFor={`cover-${playlist.id}`} onClick={(e) => e.stopPropagation()} className="p-1.5 hover:bg-purple-500 rounded-lg transition-colors cursor-pointer relative z-10">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </label>
                </div>

                <input id={`cover-${playlist.id}`} type="file" accept="image/*" className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => onUpdatePlaylistCover(playlist.id, reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
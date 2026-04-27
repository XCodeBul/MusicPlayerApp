import {useState} from "react";
import CreatePlaylistForm from "./CreatePlaylistForm/CreatePlaylistForm.jsx";
import {usePlaylistContext} from "../../../contexts/PlaylistContext.jsx";
import {usePlayerContext} from "../../../contexts/PlayerContext.jsx";
import PlaylistManageTooltip from "./PlaylistManageTooltip/PlaylistManageTooltip.jsx";

const PlaylistManager = () => {
    const {playlists, logPlaylistView} = usePlaylistContext()
    
    const {setSelectedPlaylist, setCurrentSong, selectedPlaylist} = usePlayerContext()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [tooltip, setTooltip] = useState(null)

    return (
        <div className="flex flex-col h-full relative border-r border-purple-500/10">
            <div className="flex flex-col items-center py-6 flex-shrink-0">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    onMouseEnter={() => setTooltip(null)} 
                    className="w-14 h-14 bg-transparent border-2 border-purple-500/40 text-purple-500 text-3xl font-light rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:border-purple-400 hover:text-purple-300 transition-all duration-500 transform hover:scale-105 active:scale-95"
                >
                    <span className="mb-1">+</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 custom-scrollbar">
                <div className="flex flex-col items-center gap-6 py-2">
                    {!!playlists.length && playlists.map((playlist) => {
               
                        const isActive = selectedPlaylist?.id === playlist.id;

                        return (
                            <div
                                key={playlist.id}
                                className="relative group cursor-pointer"
                                onClick={() => {
                                    setSelectedPlaylist(playlist);
                                    setCurrentSong(null);
                                    logPlaylistView(playlist.id);
                                }}
                                onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setTooltip({
                                        ...playlist,
                                        x: rect.right + 10,
                                        y: rect.top + rect.height / 2,
                                    });
                                }}
                            >
                              
                                {isActive && (
                                    <div className="absolute -inset-1.5 bg-purple-500/30 blur-md rounded-2xl animate-pulse" />
                                )}

                                <img
                                    src={playlist.cover_url || "https://pixsector.com/cache/8955ccde/avea0c6d1234636825bd6.png"}
                                    alt={playlist.name}
                                    className={`w-14 h-14 rounded-2xl object-cover shadow-lg relative z-10 transition-all duration-500 
                                        ${isActive 
                                            ? "border-2 border-purple-400 scale-105 shadow-[0_0_20px_rgba(168,85,247,0.5)]" 
                                            : "border border-white/5 group-hover:scale-110"
                                        }`}
                                />

                               
                                {isActive && (
                                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_#A855F7] z-20" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <PlaylistManageTooltip tooltip={tooltip} setTooltip={setTooltip}/>
            <CreatePlaylistForm isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen}/>
        </div>
    )
}

export default PlaylistManager;
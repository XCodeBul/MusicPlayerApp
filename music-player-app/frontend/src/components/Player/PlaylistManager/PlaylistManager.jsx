import {useState} from "react";
import CreatePlaylistForm from "./CreatePlaylistForm/CreatePlaylistForm.jsx";
import {usePlaylistContext} from "../../../contexts/PlaylistContext.jsx";
import {usePlayerContext} from "../../../contexts/PlayerContext.jsx";
import DeletePlaylist from "./DeletePlaylist/DeletePlaylist.jsx";
import PlaylistManageTooltip from "./PlaylistManageTooltip/PlaylistManageTooltip.jsx";

const PlaylistManager = () => {
    const {playlists, setPlaylistLogView} = usePlaylistContext()
    const {setSelectedPlaylist, setCurrentSong} = usePlayerContext()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [tooltip, setTooltip] = useState(null)

    return (
        <div className="flex flex-col h-full relative border-r border-purple-500/10">
            <div className="flex flex-col items-center py-6 flex-shrink-0">
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-14 h-14 bg-transparent border-2 border-purple-500/40 text-purple-500 text-3xl font-light rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:border-purple-400 hover:text-purple-300 transition-all duration-500 transform hover:scale-105 active:scale-95"
                >
                    <span className="mb-1">+</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 custom-scrollbar">
                <div className="flex flex-col items-center gap-4 py-2">
                    {!!playlists.length && playlists.map((playlist) => (
                        <div
                            key={playlist.id}
                            className="relative group cursor-pointer"
                            onClick={() => {
                                setSelectedPlaylist(playlist);
                                setCurrentSong(null);
                                setPlaylistLogView(playlist.id);
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
                            <img
                                src={playlist.cover_url || "https://pixsector.com/cache/8955ccde/avea0c6d1234636825bd6.png"}
                                alt={playlist.name}
                                className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/5
                                    transition-all duration-500 group-hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Includes */}
            <PlaylistManageTooltip tooltip={tooltip} setTooltip={setTooltip}/>

            <CreatePlaylistForm isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen}/>
        </div>
    )
}

export default PlaylistManager

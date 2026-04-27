import { useState } from 'react'; // Добави useState
import { updateSongList } from "../../../../services/playlist.js";
import { usePlaylistContext } from "../../../../contexts/PlaylistContext.jsx";

const TrackItem = ({ searchResults, showPlaylistPicker, setShowPlaylistPicker }) => {
    const { playlistsReload, playlists } = usePlaylistContext();
    const [notification, setNotification] = useState(null); // Стейт за известието

    const handleAddToPlaylist = async (track, playlistId) => {
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

        const targetPlaylist = playlists.find((p) => p.id === playlistId);
        const updatedSongs = [...(targetPlaylist?.songs || []), newSong];

        try {
            await updateSongList(playlistId, updatedSongs);
            playlistsReload();
            
            // Показваме нотификацията
            setNotification({
                trackName: track.name,
                playlistName: targetPlaylist.name
            });

            // Скриваме я след 3 секунди
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error("Failed to add song:", error);
        }

        setShowPlaylistPicker(null);
    };

    const formatDuration = (ms) => {
        const mins = Math.floor(ms / 60000);
        const secs = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
        return `${mins}:${secs}`;
    };

    return (
        <div className="p-4 space-y-2 relative">
            
            {/* --- TOAST NOTIFICATION --- */}
            {notification && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000000] 
                                bg-emerald-500/90 backdrop-blur-md px-6 py-3 rounded-2xl 
                                border border-white/20 shadow-[0_10px_40px_rgba(16,185,129,0.4)]
                                flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="fa fa-check text-white text-sm" />
                    </div>
                    <div>
                        <p className="text-white text-sm font-bold">Added to Playlist!</p>
                        <p className="text-white/80 text-xs">
                            <span className="font-black italic">{notification.trackName}</span> → {notification.playlistName}
                        </p>
                    </div>
                </div>
            )}

            {searchResults.map(track => (
                <div
                    key={track.id}
                    className="relative group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-200 cursor-default"
                >
                    {/* Твоето съществуващо рендиране на песента... */}
                    {track.album.images[2]?.url ? (
                        <img src={track.album.images[2].url} alt=""
                             className="w-14 h-14 rounded-xl shadow-lg flex-shrink-0 object-cover"/>
                    ) : (
                        <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                            🎵
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{track.name}</p>
                        <p className="text-sm text-gray-400 truncate">
                            {track.artists.map(a => a.name).join(", ")}
                        </p>
                    </div>

                    <span className="text-sm text-gray-500 px-3">{formatDuration(track.duration_ms)}</span>

                    <button
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            setShowPlaylistPicker(showPlaylistPicker === track.id ? null : track.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 w-12 h-12 bg-gradient-to-r from-green-500
                            to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-full flex items-center
                            justify-center text-xl font-bold shadow-xl transition-all duration-300 transform
                            hover:scale-110 text-white"
                    >
                        <i className="fa fa-plus"/>
                    </button>

                    {/* Playlist Picker UI */}
                    {showPlaylistPicker === track.id && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-12 top-16 bg-gray-900/98 backdrop-blur-2xl rounded-2xl 
                                       shadow-2xl border border-white/10 z-[9999999] min-w-[220px] py-2 
                                       overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                        >
                            <p className="px-6 py-2 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                                Add to playlist
                            </p>
                            
                            <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                                {!!playlists && playlists.length > 0 ? (
                                    playlists.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToPlaylist(track, p.id);
                                            }}
                                            className="px-4 py-3 hover:bg-white/10 cursor-pointer text-sm
                                                       flex items-center gap-3 transition mx-2 rounded-lg"
                                        >
                                            <div className="w-9 h-9 flex-shrink-0 bg-gray-800 rounded-md overflow-hidden flex items-center justify-center border border-white/5">
                                                {(p.cover || p.image || p.cover_url) ? (
                                                    <img 
                                                        src={p.cover || p.image || p.cover_url} 
                                                        className="w-full h-full object-cover" 
                                                        alt={p.name}
                                                    />
                                                ) : (
                                                    <span className="text-[10px] font-bold text-gray-600">PL</span>
                                                )}
                                            </div>
                                            <span className="truncate text-gray-200 font-medium">{p.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="px-6 py-4 text-xs text-gray-500 italic text-center">
                                        No playlists found
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TrackItem;
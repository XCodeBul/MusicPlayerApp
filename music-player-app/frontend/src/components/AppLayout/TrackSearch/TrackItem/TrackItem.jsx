import {updateSongList} from "../../../../services/playlist.js";
import {usePlaylistContext} from "../../../../contexts/PlaylistContext.jsx";

const TrackItem = ({searchResults, showPlaylistPicker, setShowPlaylistPicker}) => {
    const {playlistsReload, playlists} = usePlaylistContext()

    const handleAddToPlaylist = async (track, playlistId) => {
        if (!track.preview_url) {
            alert(`"${track.name}" by ${track.artists[0].name} has no preview available`)
            return
        }

        const newSong = {
            id: track.id,
            title: track.name,
            artist: track.artists[0].name,
            artistId: track.artists[0].id,
            duration: "30s",
            albumArt: track.album.images[1]?.url || track.album.images[0]?.url || null,
            src: track.preview_url,
        }

        const targetPlaylist = playlists.find((p) => p.id === playlistId)
        const updatedSongs = [...(targetPlaylist?.songs || []), newSong]

        updateSongList(playlistId, updatedSongs).then(() => playlistsReload())

        setShowPlaylistPicker(null)
    }

    const formatDuration = (ms) => {
        const mins = Math.floor(ms / 60000)
        const secs = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0")
        return `${mins}:${secs}`
    }

    return (
        <div className="p-4 space-y-2">
            {searchResults.map(track => (
                <div
                    key={track.id}
                    className="relative group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-200 cursor-default"
                >
                    {track.album.images[2]?.url ? (
                        <img src={track.album.images[2].url} alt=""
                             className="w-14 h-14 rounded-xl shadow-lg flex-shrink-0"/>
                    ) : (
                        <div
                            className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center text-2xl shadow-lg">
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
                            e.stopPropagation()
                            setShowPlaylistPicker(showPlaylistPicker === track.id ? null : track.id)
                        }}
                            className="opacity-0 group-hover:opacity-100 w-12 h-12 bg-gradient-to-r from-green-500
                            to-emerald-500 hover:from-green-400 hover:to-emerald-400 rounded-full flex items-center
                            justify-center text-xl font-bold shadow-xl transition-all duration-300 transform
                            hover:scale-110"
                    >
                        <i className={'fa fa-plus'}/>
                    </button>

                    {showPlaylistPicker === track.id && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-12 top-16 bg-gray-800/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-600 z-[9999999] min-w-[200px] py-2 overflow-hidden"
                        >
                            <p className="px-6 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                Add to playlist
                            </p>
                            {!!playlists && playlists.length > 0 ? (
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
                                        {p.cover ? <img src={p.cover} className="w-8 h-8 rounded" alt=""/> : <div
                                            className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-[10px]">PL</div>}
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
    )
}

export default TrackItem

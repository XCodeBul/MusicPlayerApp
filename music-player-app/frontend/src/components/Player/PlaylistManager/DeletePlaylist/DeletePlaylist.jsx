import {deleteUserPlaylist} from "../../../../services/playlist.js";
import {usePlaylistContext} from "../../../../contexts/PlaylistContext.jsx";

const DeletePlaylist = ({playlist}) => {
    const {playlistsReload} = usePlaylistContext()

    const handleOnDelete = (e) => {
        e.stopPropagation()
        if (confirm('Are you sure you want to delete this playlist permanently?')) {
            deleteUserPlaylist(playlist.id).then(() => playlistsReload())
        }
    }

    return (
        <button
            onClick={handleOnDelete}
            className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Playlist
        </button>
    )
}

export default DeletePlaylist

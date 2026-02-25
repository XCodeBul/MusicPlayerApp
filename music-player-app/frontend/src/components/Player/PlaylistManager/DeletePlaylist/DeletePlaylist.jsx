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
        <>
            <button
                onClick={handleOnDelete}
                className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors relative z-10"
            >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </>
    )
}

export default DeletePlaylist

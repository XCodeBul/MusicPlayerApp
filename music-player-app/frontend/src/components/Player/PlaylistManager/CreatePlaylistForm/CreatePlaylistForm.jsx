import {useState} from "react";
import {storeUserPlaylist} from "../../../../services/playlist.js";
import {useAuthUserContext} from "../../../../contexts/AuthUserContext.jsx";
import {usePlaylistContext} from "../../../../contexts/PlaylistContext.jsx";

const CreatePlaylistForm = ({isCreateModalOpen, setIsCreateModalOpen}) => {
    const {user} = useAuthUserContext()
    const {playlistsReload} = usePlaylistContext()
    const [input, setInput] = useState('')

    const handleCreate = () => {
        if (input.trim()) {
            storeUserPlaylist(user.id, input.trim()).then(() => {
                playlistsReload()
            }).catch(err => console.log(err))
            setInput('')
            setIsCreateModalOpen(false)
        }
    }

    const handleOnClose = () => {
        setIsCreateModalOpen(false)
        setInput('')
    }

    return (
        <>
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-purple-500/30 p-8 rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-[0.2em] text-center">
                            New Playlist
                        </h3>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter name..."
                            className="w-full bg-white/5 border border-purple-500/20 rounded-2xl px-5 py-4 text-white outline-none focus:border-purple-500 focus:bg-white/10 transition-all mb-8 placeholder-gray-600"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleOnClose}
                                className="flex-1 px-4 py-4 rounded-2xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all uppercase text-[10px] font-black tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex-1 px-4 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white transition-all uppercase text-[10px] font-black tracking-widest shadow-lg shadow-purple-500/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CreatePlaylistForm

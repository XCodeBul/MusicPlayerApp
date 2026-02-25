import {createContext, useContext, useEffect} from "react";
import useLocalStorageState from "../hooks/useLocalStorageState.js";
import {useAuthUserContext} from "./AuthUserContext.jsx";
import {getUserPlaylists} from "../services/playlist.js";
import {usePlayerContext} from "./PlayerContext.jsx";


// eslint-disable-next-line react-refresh/only-export-components
export const PlaylistContext = createContext({})


// eslint-disable-next-line react-refresh/only-export-components
export const usePlaylistContext = () => useContext(PlaylistContext)


export function PlaylistProvider({children}) {
    const {selectedPlaylist, setSelectedPlaylist} = usePlayerContext()

    const {user} = useAuthUserContext()
    const [playlists, setPlaylists] = useLocalStorageState('playlists', [])

    useEffect(() => {
        if (user && !playlists.length) {
            setPlaylistData()
        }
    }, [user])

    const playlistsReload = () => {
        setPlaylistData()
        console.log('Playlist reload')
    }

    const setPlaylistData = () => {
        getUserPlaylists(user.id).then(data => {
            setPlaylists(data)
            if (selectedPlaylist) {
                setSelectedPlaylist(data.find(playlist => playlist.id === selectedPlaylist.id))
            }
        }).catch(err => console.log(err))
    }

    return (
        <PlaylistContext.Provider
            value={{
                playlists,
                playlistsReload,
                setPlaylists
            }}
        >
            {children}
        </PlaylistContext.Provider>
    )
}

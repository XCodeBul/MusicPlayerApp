import {createContext, useContext, useEffect} from "react";
import useLocalStorageState from "../hooks/useLocalStorageState.js";
import {useAuthUserContext} from "./AuthUserContext.jsx";
import {getUserPlaylist} from "../services/playlist.js";


// eslint-disable-next-line react-refresh/only-export-components
export const PlaylistContext = createContext({})


// eslint-disable-next-line react-refresh/only-export-components
export const usePlaylistContext = () => useContext(PlaylistContext)


export function PlaylistProvider({children}) {
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
        getUserPlaylist(user.id).then(data => {
            setPlaylists(data)
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

import {createContext, useContext, useEffect} from "react";
import useLocalStorageState from "../hooks/useLocalStorageState.js";
import {useAuthUserContext} from "./AuthUserContext.jsx";
import {getUserPlaylists, updatePlaylist as updatePlaylistService} from "../services/playlist.js";
import {usePlayerContext} from "./PlayerContext.jsx";

// eslint-disable-next-line react-refresh/only-export-components
export const PlaylistContext = createContext({})


// eslint-disable-next-line react-refresh/only-export-components
export const usePlaylistContext = () => useContext(PlaylistContext)


export function PlaylistProvider({children}) {
    const {selectedPlaylist, setSelectedPlaylist} = usePlayerContext()
    const {user} = useAuthUserContext()
    const [playlists, setPlaylists] = useLocalStorageState('playlists', [])

    const setPlaylistData = () => {
        if (!user) return Promise.resolve()

        return getUserPlaylists(user.id).then(data => {
            setPlaylists(data)

            if (selectedPlaylist) {
                const updated = data.find(p => p.id === selectedPlaylist.id);
                if (updated) setSelectedPlaylist(updated)
            }
            return data;
        }).catch(err => console.error("Грешка при зареждане на плейлисти:", err))
    };

    const updatePlaylist = async (id, updatedData) => {
        try {
            await updatePlaylistService(id, updatedData)

            await setPlaylistData()

            console.log(`Playlist ${id} updated successfully.`)
        } catch (err) {
            console.error("Грешка при обновяване на плейлиста:", err)
            throw err
        }
    }

    useEffect(() => {
        const handleRefresh = () => setPlaylistData()

        window.addEventListener("refresh-playlists", handleRefresh)
        return () => window.removeEventListener("refresh-playlists", handleRefresh)
    }, [user, selectedPlaylist])

    useEffect(() => {
        if (user && !playlists.length) {
            setPlaylistData()
        }
    }, [user])

    const playlistsReload = async () => await setPlaylistData()

    return (
        <PlaylistContext.Provider
            value={{
                playlists,
                playlistsReload,
                setPlaylists,
                updatePlaylist
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
}
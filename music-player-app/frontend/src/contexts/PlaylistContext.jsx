import { createContext, useContext, useEffect } from "react";
import useLocalStorageState from "../hooks/useLocalStorageState.js";
import { useAuthUserContext } from "./AuthUserContext.jsx";
import { getUserPlaylists, updatePlaylist as updatePlaylistService } from "../services/playlist.js";
import { usePlayerContext } from "./PlayerContext.jsx";
import { supabase } from "../supabaseClient.js"; 

// eslint-disable-next-line react-refresh/only-export-components
export const PlaylistContext = createContext({})

// eslint-disable-next-line react-refresh/only-export-components
export const usePlaylistContext = () => useContext(PlaylistContext)

export function PlaylistProvider({ children }) {
    const { selectedPlaylist, setSelectedPlaylist } = usePlayerContext()
    const { user } = useAuthUserContext()
    const [playlists, setPlaylists] = useLocalStorageState('playlists', [])

    const setPlaylistLogView = async (playlistId) => {
        if (!user || !playlistId) return;

        const today = new Date().toISOString().split('T')[0];
        const storageKey = `logged_playlists_${user.id}`;

        const localLogs = JSON.parse(localStorage.getItem(storageKey) || "{}");
        if (localLogs[playlistId] === today) {
            console.log("Вече е логнато локално за днес.");
            return;
        }

        try {
            const { error } = await supabase
                .from('playlist_logs')
                .upsert({ 
                    user_id: user.id, 
                    playlist_id: playlistId, 
                    log_date: today 
                }, { onConflict: 'user_id, playlist_id, log_date' });

            if (!error) {
                localLogs[playlistId] = today;
                localStorage.setItem(storageKey, JSON.stringify(localLogs));
                console.log(`Logged visit for playlist ${playlistId}`);
            } else {
                console.error("Supabase error:", error.message);
            }
        } catch (err) {
            console.error("Грешка при логване на плейлист:", err);
        }
    };

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
                updatePlaylist,
                setPlaylistLogView
            }}
        >
            {children}
        </PlaylistContext.Provider>
    );
}

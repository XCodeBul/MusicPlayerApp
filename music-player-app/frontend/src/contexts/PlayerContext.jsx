import { createContext, useContext, useRef, useState } from "react";
import { removeSongFromUserPlaylist } from "../services/playlist.js";

export const PlayerContext = createContext({});
export const usePlayerContext = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
    const musicAudioRef = useRef(null);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
        setProgress(0);
    };

    const removeSongFromPlaylist = async (songId) => {
        if (!selectedPlaylist) return;

        const updatedSongs = selectedPlaylist.songs.filter(
            (song) => String(song.id) !== String(songId)
        );

        try {
            await removeSongFromUserPlaylist(selectedPlaylist.id, updatedSongs);
            setSelectedPlaylist({
                ...selectedPlaylist,
                songs: updatedSongs
            });

            window.dispatchEvent(new Event("refresh-playlists"));
            if (String(currentSong?.id) === String(songId)) {
                setIsPlaying(false);
                setCurrentSong(null);
            }
        } catch (error) {
            console.error("Грешка при триене:", error);
            alert("Неуспешно премахване от базата данни.");
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                selectedPlaylist,
                setSelectedPlaylist,
                musicAudioRef,
                currentSong,
                setCurrentSong,
                isPlaying,
                setIsPlaying,
                progress,
                setProgress,
                playSong,
                removeSongFromPlaylist
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}
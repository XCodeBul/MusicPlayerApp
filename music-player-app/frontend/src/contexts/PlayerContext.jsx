import {createContext, useContext, useRef, useState} from "react";
import {usePlaylistContext} from "./PlaylistContext.jsx";


// eslint-disable-next-line react-refresh/only-export-components
export const PlayerContext = createContext({})


// eslint-disable-next-line react-refresh/only-export-components
export const usePlayerContext = () => useContext(PlayerContext)


export function PlayerProvider({children}) {
    const musicAudioRef = useRef(null)
    const [selectedPlaylist, setSelectedPlaylist] = useState(null)
    const [currentSong, setCurrentSong] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)

    const playSong = (song) => {
        setCurrentSong(song)
        setIsPlaying(true)
        setProgress(0)
    }

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
                playSong
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

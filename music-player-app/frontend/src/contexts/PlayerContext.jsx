import {createContext, useContext, useEffect, useRef, useState} from "react";


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
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

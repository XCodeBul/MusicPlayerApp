import React, {useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuthUserContext} from "../../contexts/AuthUserContext.jsx";
import {useLocalizationContext} from "../../contexts/LocalizationContext.jsx";
import PopularArtists from "./PopularArtists/PopularArtists.jsx";
import TopHits from "./TopHits/TopHits.jsx";
import TrackPlayer from "./TrackPlayer/TrackPlayer.jsx";
import {PATHS} from "../../config/paths.js";

const HomePage = () => {
    const {user} = useAuthUserContext()
    const {t} = useLocalizationContext()
    const navigate = useNavigate()
    const home = t?.home
    const [currentTrack, setCurrentTrack] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const audioRef = useRef(new Audio())

    const playTrack = (trackList, index = 0) => {
        if (!trackList || index >= trackList.length) return

        const track = trackList[index]
        const audio = audioRef.current

        const trackData = {
            title: track.title,
            artist: track.artist.name || track.artist,
            audioUrl: track.preview,
            cover: track.album?.cover_medium || track.cover,
        }

        audio.pause()
        audio.oncanplaythrough = null
        audio.onerror = null

        audio.src = trackData.audioUrl
        audio.load()

        audio.oncanplaythrough = () => {
            audio.play()
                .then(() => {
                    setCurrentTrack(trackData)
                    setIsPlaying(true)
                })
                .catch(() => playTrack(trackList, index + 1))
        }

        audio.onerror = () => {
            playTrack(trackList, index + 1)
        }
    }

    const pauseTrack = () => {
        audioRef.current.pause()
        setCurrentTrack(null)
        setIsPlaying(false)
    }

    const togglePlayback = () => {
        isPlaying ? audioRef.current.pause() : audioRef.current.play()
        setIsPlaying(!isPlaying)
    }

    const handleStartClick = () => navigate(user ? PATHS.player : PATHS.login)

    return (
        <div className="flex-1 w-full flex flex-col items-center relative px-6 overflow-y-auto pt-5 md:pt-32 md:pb-32
            custom-scrollbar">
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center transition-colors
                duration-1000">
                <div className="w-full max-w-[800px] h-[400px] rounded-full blur-[140px] transition-all duration-1000"
                    style={{backgroundColor: isPlaying ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.15)'}}
                />
            </div>

            <div className="relative z-20 text-center flex flex-col items-center max-w-5xl mb-[30px] md:mb-48">
                <div className="mb-5 md:mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border
                    border-white/10 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-purple-500 opacity-75">
                        </span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-purple-300/90">
                        {home.experience}
                    </span>
                </div>

                <h1 className="text-5xl md:text-9xl lg:text-[10rem] font-black italic tracking-tighter text-white
                    uppercase leading-none mb-8">
                    Music<span className="text-purple-600 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">Note</span>
                </h1>

                <p className="text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto mb-5 md:mb-14 opacity-80">
                    {home.heroSubtitle}
                </p>

                <button
                    onClick={handleStartClick}
                    className="group relative px-10 md:px-20 py-6 bg-white text-black font-black uppercase tracking-[0.4em]
                        text-[11px] rounded-2xl transition-all duration-500 overflow-hidden hover:text-white
                        hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] active:scale-95"
                >
                    <div className="absolute inset-0 bg-purple-600 translate-x-[-101%] group-hover:translate-x-0
                        transition-transform duration-500"/>
                    <span className="relative z-10 italic">{home.startListening}</span>
                </button>
            </div>

            <PopularArtists playTrack={playTrack}/>

            <TopHits playTrack={playTrack}/>

            <TrackPlayer
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                togglePlayback={togglePlayback}
                pauseTrack={pauseTrack}
            />
        </div>
    )
}

export default HomePage

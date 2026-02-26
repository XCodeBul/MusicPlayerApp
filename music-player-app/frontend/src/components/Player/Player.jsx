import PlaylistManager from "./PlaylistManager/PlaylistManager.jsx";
import MusicPlayer from "./MusicPlayer/MusicPlayer.jsx";
import {usePlayerContext} from "../../contexts/PlayerContext.jsx";
import Visualizer from "./Visualizer/Visualizer.jsx";
import Lyrics from "./Lyrics/Lyrics.jsx";
import {useAuthUserContext} from "../../contexts/AuthUserContext.jsx";
import ArtistDetails from "./ArtistDetails/ArtistDetails.jsx";
import TrackQueue from "./TrackQueue/TrackQueue.jsx";
import {useLocalizationContext} from "../../contexts/LocalizationContext.jsx";

const Player = () => {
    const {
        selectedPlaylist,
        musicAudioRef,
        currentSong,
        playSong,
        isPlaying,
        setIsPlaying,
        progress,
        setProgress
    } = usePlayerContext()
    const {t, language} = useLocalizationContext()
    const {user} = useAuthUserContext()

    const handlePlayPause = () => setIsPlaying((prev) => !prev)

    const handleNext = () => {
        if (!selectedPlaylist || selectedPlaylist.songs.length === 0) return
        const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id)
        const next = selectedPlaylist.songs[(idx + 1) % selectedPlaylist.songs.length]
        playSong(next)
    }

    const handlePrev = () => {
        if (!selectedPlaylist || selectedPlaylist.songs.length === 0) return
        const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id)
        const prev = selectedPlaylist.songs[(idx - 1 + selectedPlaylist.songs.length) % selectedPlaylist.songs.length]
        playSong(prev)
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            <aside
                className="md:flex w-20 lg:w-24 bg-gray-900/50 rounded-3xl flex-col shadow-xl ml-4 my-4 flex-shrink-0">
                <PlaylistManager/>
            </aside>

            <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
                <div className="flex flex-row lg:h-[330px] items-stretch flex-shrink-0 w-full overflow-hidden">
                    <div className="scale-90 origin-top-left shrink-0 group">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100
                            transition-opacity duration-700 pointer-events-none"/>
                        <MusicPlayer
                            ref={musicAudioRef}
                            currentSong={currentSong}
                            isPlaying={isPlaying}
                            onPlayPause={handlePlayPause}
                            onNext={handleNext}
                            onPrev={handlePrev}
                            progress={progress}
                            onSeek={newProgress => setProgress(newProgress)}
                        />
                    </div>

                    <div className="hidden md:flex flex-1 -ml-6 h-[300px] flex-col transition-all duration-300">
                        <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-2 border border-purple-500/20
                            shadow-2xl flex-1 flex flex-col justify-center overflow-hidden relative group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-700 pointer-events-none"/>
                            {currentSong ? (
                                <ArtistDetails currentSong={currentSong}/>
                            ) : (
                                <div className="flex-1 flex flex-row items-center justify-center text-center gap-6">
                                    <div
                                        className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center
                                        justify-center text-3xl border border-purple-500/20 shadow-inner shrink-0
                                        grayscale opacity-40">
                                        👤
                                    </div>
                                    <div className="text-left">

                                        <h3 className="text-purple-500/50 font-black text-[10px] uppercase
                                        tracking-[0.4em] mb-1">
                                            {t.systemDetail}
                                        </h3>
                                        <h2 className="text-white font-bold text-lg leading-tight uppercase
                                        tracking-tight">
                                            {t.artistDetails}
                                        </h2>
                                        <p className="text-gray-500 text-xs font-medium">
                                            {t.selectTrack}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col -mt-4 mb-4 overflow-hidden">
                    <div className="flex-1 flex gap-5 overflow-hidden">
                        {/* TrackQueue Section */}
                        <div className="w-full max-w-2xl flex-1 lg:bg-gray-900/40 lg:backdrop-blur-xl lg:rounded-[2.5rem]
                            lg:p-8 lg:border lg:border-purple-500/20 lg:shadow-2xl relative group">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-700 pointer-events-none"/>
                            <TrackQueue/>
                        </div>

                        {/* Visualizer Section */}
                        <div className="hidden md:flex w-[400px] flex-shrink-0 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem]
                            border border-purple-500/20 shadow-2xl items-center justify-center overflow-hidden
                            relative group">
                            <div
                                className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-700 pointer-events-none"/>
                            {user && currentSong ? (
                                <Visualizer audioRef={musicAudioRef} currentSong={currentSong}/>
                            ) : (
                                <div className="text-center relative z-10">
                                    <div className="flex flex-col items-center gap-2">
                                        <span
                                            className="text-purple-500/40 text-[10px] font-black uppercase
                                            tracking-[0.4em] animate-pulse">
                                          {t.signalOffline}
                                        </span>
                                        <div className="text-gray-600 font-bold tracking-widest text-xs">
                                            {t.systemIdle}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r
                                from-transparent via-purple-500/20 to-transparent"/>
                        </div>

                        {/* Lyrics Section */}
                        <div className="hidden md:flex flex-1 min-w-[300px] flex-col overflow-hidden">
                            {currentSong ? (
                                <Lyrics currentSong={currentSong}/>
                            ) : (
                                <div className="flex-1 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem]
                                    border border-purple-500/20 shadow-2xl flex items-center justify-center relative
                                    overflow-hidden group">
                                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100
                                        transition-opacity duration-500"/>

                                    <div className="text-center relative z-10">
                                        <div className="text-3xl mb-4 opacity-20 filter grayscale hover:grayscale-0
                                            transition-all duration-700">
                                            📝
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-purple-500/40 text-[10px] font-black uppercase
                                                tracking-[0.4em]">
                                                {language === 'EN' ? 'System Standby' : 'Системен режим на готовност'}
                                            </p>
                                            <p className="text-gray-600 font-bold tracking-widest text-xs">
                                                {language === 'EN' ? 'Lyrics Off-line' : 'Текстовете са офлайн'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r
                                        from-transparent via-purple-500/20 to-transparent"/>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Player

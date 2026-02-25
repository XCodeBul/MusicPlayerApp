import PlaylistManager from "./PlaylistManager/PlaylistManager.jsx";
import MusicPlayer from "./MusicPlayer/MusicPlayer.jsx";
import {usePlayerContext} from "../../contexts/PlayerContext.jsx";
import {useLocalization} from "../../hooks/useLocalization.js";
import ArtistInfo from "../ArtistInfo.jsx";
import Visualizer from "../Visualizer.jsx";
import Lyrics from "../Lyrics.jsx";
import {useAuthUserContext} from "../../contexts/AuthUserContext.jsx";
import {useEffect} from "react";

const Player = () => {
    const {
        selectedPlaylist,
        musicAudioRef,
        currentSong,
        setCurrentSong,
        isPlaying,
        setIsPlaying,
        progress,
        setProgress
    } = usePlayerContext()
    const {t, language} = useLocalization()
    const {user} = useAuthUserContext()

    const handlePlayPause = () => setIsPlaying((prev) => !prev)

    const handleNext = () => {
        if (!selectedPlaylist || selectedPlaylist.songs.length === 0) return;
        const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id);
        const next = selectedPlaylist.songs[(idx + 1) % selectedPlaylist.songs.length];
        playSong(next)
    }

    const handlePrev = () => {
        if (!selectedPlaylist || selectedPlaylist.songs.length === 0) return;
        const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id);
        const prev = selectedPlaylist.songs[(idx - 1 + selectedPlaylist.songs.length) % selectedPlaylist.songs.length];
        playSong(prev)
    }

    const playSong = (song) => {
        setCurrentSong(song)
        setIsPlaying(true)
        setProgress(0)
    }

    useEffect(() => {
        console.log(selectedPlaylist?.songs)
    }, [selectedPlaylist]);

    return (
        <div className="flex flex-1 overflow-hidden">
            <aside
                className="hidden md:flex w-20 lg:w-24 bg-gray-900/50 rounded-3xl flex-col shadow-xl ml-4 my-4 flex-shrink-0">
                <PlaylistManager/>
            </aside>

            <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
                <div className="flex flex-row items-stretch flex-shrink-0 w-full overflow-hidden">
                    <div className="scale-90 origin-top-left shrink-0">
                        <MusicPlayer
                            ref={musicAudioRef}
                            currentSong={currentSong}
                            isPlaying={isPlaying}
                            onPlayPause={handlePlayPause}
                            onNext={handleNext}
                            onPrev={handlePrev}
                            progress={progress}
                            onSeek={(newProgress) => setProgress(newProgress)}
                        />
                    </div>

                    <div className="flex-1 -ml-6 py-[1.9%] -mt-9 flex flex-col transition-all duration-300 min-w-0">

                        <div
                            className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20 shadow-2xl flex-1 flex flex-col justify-center overflow-hidden relative">


                            <div
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"/>

                            {currentSong ? (
                                <ArtistInfo currentSong={currentSong} t={t}/>
                            ) : (
                                <div className="flex-1 flex flex-row items-center justify-center text-center gap-6">

                                    <div
                                        className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-3xl border border-purple-500/20 shadow-inner shrink-0 grayscale opacity-40">
                                        👤
                                    </div>
                                    <div className="text-left">

                                        <h3 className="text-purple-500/50 font-black text-[10px] uppercase tracking-[0.4em] mb-1">
                                            {t.systemDetail}
                                        </h3>
                                        <h2 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">
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


                        <div
                            className="w-full max-w-2xl flex-1 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-purple-500/20 shadow-2xl overflow-y-auto custom-scrollbar relative">


                            <div className="mb-8 flex items-center justify-between shrink-0">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    <span className="text-purple-500 opacity-50">#</span>
                                    {selectedPlaylist ? selectedPlaylist.name : t.queue}
                                </h3>
                                <span className="text-[10px] font-black text-purple-500/40 uppercase tracking-[0.3em]">
      {selectedPlaylist?.songs?.length || 0} {t.tracks}
    </span>
                            </div>

                            {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
                                <ul className="space-y-3">
                                    {selectedPlaylist.songs.map((song) => (
                                        <li
                                            key={song.id}
                                            onClick={() => playSong(song)}
                                            className={`flex items-center gap-5 p-4 rounded-2xl cursor-pointer transition-all duration-300 group border ${
                                                currentSong?.id === song.id
                                                    ? "bg-purple-600/20 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                                                    : "bg-white/5 border-transparent hover:bg-white/10 hover:border-purple-500/10"
                                            }`}
                                        >

                                            <div className="relative">
                                                {song.albumArt ? (
                                                    <img src={song.albumArt}
                                                         className="w-12 h-12 rounded-xl shadow-lg group-hover:scale-105 transition-transform object-cover"
                                                         alt=""/>
                                                ) : (
                                                    <div
                                                        className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl flex items-center justify-center text-xl shadow-lg">
                                                        🎵
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className={`font-bold truncate transition-colors ${
                                                    currentSong?.id === song.id ? "text-purple-300" : "text-gray-200 group-hover:text-purple-400"
                                                }`}>
                                                    {song.title}
                                                </p>
                                                <p className="text-sm text-gray-500 font-medium truncate italic">{song.artist}</p>
                                            </div>

                                            <div className="flex items-center gap-3">

                                                {currentSong?.id === song.id && (
                                                    <div className="flex gap-[2px] items-end h-3">
                                                        <div
                                                            className="w-[2px] bg-purple-500 animate-[bounce_1s_infinite_0.1s] h-full"></div>
                                                        <div
                                                            className="w-[2px] bg-purple-500 animate-[bounce_1.2s_infinite_0.3s] h-2/3"></div>
                                                        <div
                                                            className="w-[2px] bg-purple-500 animate-[bounce_0.8s_infinite_0.2s] h-1/2"></div>
                                                    </div>
                                                )}
                                                <span
                                                    className="text-[10px] text-purple-400 font-black tracking-widest opacity-50 uppercase">30s</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (

                                <div className="text-center py-24 flex flex-col items-center justify-center opacity-40">
                                    <div
                                        className="w-16 h-16 rounded-full border border-purple-500/20 flex items-center justify-center mb-4">
                                        <span className="text-2xl grayscale">🎶</span>
                                    </div>
                                    <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em]">{language === 'EN' ? 'Queue Empty' : 'Опашката е празна'}</p>
                                    <p className="mt-2 text-gray-600 text-[10px] font-medium uppercase tracking-widest">{t.awaitingSignal}</p>
                                </div>
                            )}


                            <div
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"/>
                        </div>


                        <div
                            className="w-[400px] flex-shrink-0 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-purple-500/20 shadow-2xl flex items-center justify-center overflow-hidden relative group">


                            <div
                                className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"/>

                            {user && currentSong ? (
                                <Visualizer audioRef={musicAudioRef} currentSong={currentSong}/>
                            ) : (
                                <div className="text-center relative z-10">
                                    <div className="flex flex-col items-center gap-2">
        <span className="text-purple-500/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
          {t.signalOffline}
        </span>
                                        <div className="text-gray-600 font-bold tracking-widest text-xs">
                                            {t.systemIdle}
                                        </div>
                                    </div>
                                </div>
                            )}


                            <div
                                className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"/>
                        </div>


                        <div className="flex-1 min-w-[300px] flex flex-col overflow-hidden">
                            {currentSong ? (
                                <Lyrics currentSong={currentSong}/>
                            ) : (

                                <div
                                    className="flex-1 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-purple-500/20 shadow-2xl flex items-center justify-center relative overflow-hidden group">


                                    <div
                                        className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>

                                    <div className="text-center relative z-10">
                                        <div
                                            className="text-3xl mb-4 opacity-20 filter grayscale hover:grayscale-0 transition-all duration-700">
                                            📝
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <p className="text-purple-500/40 text-[10px] font-black uppercase tracking-[0.4em]">
                                                {language === 'EN' ? 'System Standby' : 'Системен режим на готовност'}
                                            </p>
                                            <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">
                                                {language === 'EN' ? 'Lyrics Off-line' : 'Текстовете са офлайн'}
                                            </p>
                                        </div>
                                    </div>


                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"/>
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

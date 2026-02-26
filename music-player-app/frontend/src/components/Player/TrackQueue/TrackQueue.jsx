import {usePlayerContext} from "../../../contexts/PlayerContext.jsx";
import {useLocalizationContext} from "../../../contexts/LocalizationContext.jsx";

const TrackQueue = () => {
    const {t, language} = useLocalizationContext()
    const {
        selectedPlaylist,
        currentSong,
        playSong
    } = usePlayerContext()

    return (
        <>
            <div className="mb-2 lg:mb-8 py-3 md:py-0 flex items-center justify-between shrink-0">
                <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    <span className="text-purple-500 opacity-50">#</span>
                    {selectedPlaylist ? selectedPlaylist.name : t.queue}
                </h3>
                <span className="text-[10px] font-black text-purple-500/40 uppercase tracking-[0.3em]">
                    {selectedPlaylist?.songs?.length || 0} {t.tracks}
                </span>
            </div>

            <div className={'h-[270px] overflow-y-auto custom-scrollbar'}>
                {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
                    <ul className="space-y-3 pr-1 lg:pr-2">
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
                    <div className="text-center py-6 xl:py-10 lg:py-24 flex flex-col items-center justify-center opacity-40">
                        <div
                            className="w-16 h-16 rounded-full border border-purple-500/20 flex items-center
                            justify-center mb-4">
                            <span className="text-2xl grayscale">🎶</span>
                        </div>
                        <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em]">
                            {language === 'EN' ? 'Queue Empty' : 'Опашката е празна'}
                        </p>
                        <p className="mt-2 text-gray-600 text-[10px] font-medium uppercase tracking-widest">
                            {t.awaitingSignal}
                        </p>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r
                                from-transparent via-purple-500/20 to-transparent"/>
        </>
    )
}

export default TrackQueue

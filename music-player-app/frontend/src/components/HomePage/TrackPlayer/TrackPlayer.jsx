import React from "react";

const TrackPlayer = ({currentTrack, isPlaying, togglePlayback, pauseTrack}) => {
    // Плеърът се показва само ако има избрана песен (currentTrack)
    return currentTrack && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in
            slide-in-from-bottom-10 duration-500">
            
            <div className="p-3 rounded-[2rem] flex items-center gap-4 border border-white/10 bg-black/80
                backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* СНИМКА НА ПЕСЕНТА:
                    Ако песента свири, снимката се върти бавно и има пулсиращо лилаво сияние отзад. */}
                <div className="relative shrink-0">
                    <div className={`absolute inset-0 bg-purple-500/20 rounded-full blur-md 
                        ${isPlaying ? 'animate-pulse' : 'opacity-0'}`}></div>
                    <img src={currentTrack.cover} alt="cover"
                         className={`relative w-12 h-12 rounded-full border border-white/10 object-cover 
                            ${isPlaying ? 'animate-spin-slow' : ''}`}/>
                </div>

                {/* ИНФОРМАЦИЯ: Име и изпълнител. 
                    Малката лилава точка пулсира („ping“ ефект), докато музиката тече. */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-white text-[13px] font-black italic uppercase truncate leading-none">
                        {currentTrack.title}
                    </h4>
                    <p className="text-purple-500/80 text-[10px] font-bold uppercase tracking-widest mt-1.5 flex
                        items-center gap-1.5">
                        <span className={`w-1 h-1 rounded-full bg-purple-500 ${isPlaying ? 'animate-ping' : ''}`}>
                        </span>
                        {currentTrack.artist}
                    </p>
                </div>

                {/* БУТОНИ ЗА УПРАВЛЕНИЕ: */}
                <div className="flex items-center gap-2">
                    {/* Бутон Play/Pause: Сменя иконката според състоянието */}
                    <button
                        onClick={togglePlayback}
                        className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center
                            hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                        {isPlaying ? (
                            /* Иконка "Пауза" */
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        ) : (
                            /* Иконка "Плей" */
                            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        )}
                    </button>

                    {/* Бутон "Х": Спира песента и затваря плеъра */}
                    <button onClick={pauseTrack} className="p-2 text-gray-500 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TrackPlayer
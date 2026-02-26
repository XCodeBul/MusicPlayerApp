import {useLocalizationContext} from "../../../contexts/LocalizationContext.jsx";

const Footer = () => {
    const isPlaying = false
    const {t} = useLocalizationContext()

    return (
        <footer
            className="hidden sm:flex bg-gray-900/40 backdrop-blur-2xl px-12 py-5 border-t border-purple-500/20 flex-shrink-0 relative transition-colors duration-700">

            <div className={`absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-1000 ${
                isPlaying ? "bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-100" : "bg-white/5 opacity-50"
            }`}/>

            <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">


                <div className="flex items-center gap-4">
                    <div className="flex items-end gap-[3px] h-4">
                        {[0.1, 0.3, 0.2, 0.5].map((delay, i) => (
                            <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-500 ${
                                    isPlaying
                                        ? "bg-purple-500 shadow-[0_0_8px_#A855F7] animate-bounce"
                                        : "bg-gray-700 h-1"
                                }`}
                                style={{
                                    animationDelay: `${delay}s`,
                                    height: isPlaying ? (i % 2 === 0 ? '60%' : '100%') : '4px'
                                }}
                            />
                        ))}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all duration-700 ${
                        isPlaying ? "text-purple-500" : "text-gray-600 opacity-40"
                    }`}>
                        {isPlaying ? t.signalActive : t.coreIdle}
                    </span>
                </div>


                <div className={`flex items-center gap-10 transition-all duration-1000 ${
                    isPlaying ? "opacity-100 blur-0" : "opacity-30 blur-[1px]"
                }`}>
                    <div className="flex flex-col items-end border-r border-purple-500/10 pr-10">
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-500/40 mb-1">{t.localTime}</span>
                        <span className="text-sm font-bold text-white tabular-nums tracking-widest uppercase italic">
                          {new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                        </span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span
                            className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-500/40 mb-1">{t.systemDate}</span>
                        <span className="text-sm font-bold text-white tracking-widest uppercase italic">
          {new Date().toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'})}
        </span>
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer

import { useEffect, useState } from 'react'; 
import { useLocalizationContext } from "../../../contexts/LocalizationContext.jsx";

const Footer = ({ isPlaying = false }) => { 
    const { t } = useLocalizationContext();
    const [time, setTime] = useState(new Date());

    
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <footer className="hidden sm:flex bg-black/20 backdrop-blur-3xl px-12 py-5 border-t border-white/5 flex-shrink-0 relative transition-all duration-1000">
            
           
            <div className={`absolute top-0 left-0 right-0 h-[1px] transition-all duration-1000 ${
                isPlaying 
                ? "bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-100 shadow-[0_0_15px_#A855F7]" 
                : "bg-white/5 opacity-50"
            }`}/>

            <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">

               
                <div className="flex items-center gap-6">
                    <div className="flex items-end gap-[3px] h-5 w-8">
                        {[0.1, 0.3, 0.2, 0.5, 0.4].map((delay, i) => (
                            <div
                                key={i}
                                className={`w-[3px] rounded-full transition-all duration-500 ${
                                    isPlaying
                                        ? "bg-purple-500 shadow-[0_0_10px_#A855F7] animate-bounce"
                                        : "bg-gray-800 h-1"
                                }`}
                                style={{
                                    animationDelay: `${delay}s`,
                                    height: isPlaying ? '100%' : '4px',
                                    animationDuration: '0.6s'
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-all duration-700 ${
                            isPlaying ? "text-purple-400" : "text-gray-600"
                        }`}>
                            {isPlaying ? t.signalActive : t.coreIdle}
                        </span>
                        <span className="text-[7px] text-white/10 uppercase tracking-[0.2em] font-bold">System Status</span>
                    </div>
                </div>

                
                <div className={`flex items-center gap-12 transition-all duration-1000 ${
                    isPlaying ? "opacity-100" : "opacity-40"
                }`}>
                    
                    <div className="flex flex-col items-end border-r border-white/5 pr-12">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/50 mb-1">
                            {t.localTime}
                        </span>
                        <span className="text-xs font-bold text-white tabular-nums tracking-[0.2em] uppercase italic">
                            {time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}
                        </span>
                    </div>

                    
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-500/50 mb-1">
                            {t.systemDate}
                        </span>
                        <span className="text-xs font-bold text-white tracking-[0.2em] uppercase italic">
                            {time.toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'})}
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
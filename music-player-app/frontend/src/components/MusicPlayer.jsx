import { forwardRef, useEffect } from "react";

const MusicPlayer = forwardRef(
  ({ currentSong, isPlaying, onPlayPause, onNext, onPrev, progress, onSeek, t }, ref) => {

    useEffect(() => {
      if (!ref.current || !currentSong) return;
      if (isPlaying) {
        ref.current.play().catch(e => console.error("Play error:", e));
      } else {
        ref.current.pause();
      }
    }, [isPlaying, currentSong, ref]);

    useEffect(() => {
      if (ref.current && currentSong) {
        if (Math.abs(ref.current.currentTime - progress) > 0.5) {
          ref.current.currentTime = progress;
        }
      }
    }, [progress, ref, currentSong]);


    if (!currentSong)
      return (
        <div className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-purple-500/20 shadow-2xl w-[380px] flex flex-col items-center text-center gap-4">
          <div className="w-56 h-56 bg-purple-500/5 rounded-2xl flex items-center justify-center border border-purple-500/10">
            <span className="text-purple-500/20 text-4xl grayscale">🎵</span>
          </div>
          <p className="text-purple-500/40 font-black uppercase tracking-[0.3em] text-[10px]">{t.selectTrack}</p>
        </div>
      );


    return (
      <div className="bg-gray-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-purple-500/20 shadow-2xl w-[380px] flex flex-col text-center h-full relative overflow-hidden">
        

        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-600/10 blur-[50px] pointer-events-none" />

        <div className="flex flex-col items-center gap-4 w-full relative z-10">
          <img
            src={currentSong.albumArt || "https://via.placeholder.com/224"}
            alt={currentSong.title}
            className="w-56 h-56 object-cover rounded-2xl shadow-2xl border border-white/5"
          />

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight">
              {currentSong.title}
            </h2>
            <p className="text-purple-400 font-bold italic text-sm">{currentSong.artist}</p>
          </div>

          <input
            type="range"
            min="0"
            max={30}
            value={progress || 0}
            onChange={(e) => {
              const val = Number(e.target.value);
              onSeek(val);
              if (ref.current) ref.current.currentTime = val;
            }}
            className="w-full h-1.5 rounded-full cursor-pointer accent-purple-500 appearance-none bg-white/10 transition-all"
            style={{
              background: `linear-gradient(to right, #A855F7 ${ (progress / 30) * 100 }%, rgba(255,255,255,0.1) ${ (progress / 30) * 100 }%)`
            }}
          />
        </div>

        <div className="mt-auto pt-6 flex items-center justify-center gap-6 relative z-10">
          <button
            onClick={onPrev}
            className="bg-white/5 hover:bg-purple-500/20 text-white/70 hover:text-purple-300 px-4 py-2 rounded-full transition-all text-[10px] font-black uppercase tracking-widest border border-white/5"
          >
            Prev
          </button>

          <button
            onClick={onPlayPause}
            className="bg-purple-600 hover:bg-purple-500 text-white font-black px-8 py-2 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform active:scale-95 uppercase text-xs tracking-widest border border-purple-400/30"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            onClick={onNext}
            className="bg-white/5 hover:bg-purple-500/20 text-white/70 hover:text-purple-300 px-4 py-2 rounded-full transition-all text-[10px] font-black uppercase tracking-widest border border-white/5"
          >
            Next
          </button>
        </div>

        <audio
          ref={ref}
          src={currentSong.src}
          crossOrigin="anonymous"
          onTimeUpdate={(e) => onSeek(e.currentTarget.currentTime)}
          onEnded={onNext}
        />


        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </div>
    );
  }
);

export default MusicPlayer;
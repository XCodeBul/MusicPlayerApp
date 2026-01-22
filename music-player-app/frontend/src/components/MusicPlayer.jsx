import { forwardRef, useEffect } from "react";

const MusicPlayer = forwardRef(
  ({ currentSong, isPlaying, onPlayPause, onNext, onPrev, progress, onSeek }, ref) => {


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
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-[380px] flex flex-col items-center text-center gap-4">
          <div className="w-56 h-56 bg-gray-700 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500">No song</span>
          </div>
          <p className="text-gray-400">Select a song to play</p>
        </div>
      );

    return (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-[380px] flex flex-col text-center h-full">

 
    <div className="flex flex-col items-center gap-4 w-full">
      <img
        src={currentSong.albumArt || "https://via.placeholder.com/224"}
        alt={currentSong.title}
        className="w-56 h-56 object-cover rounded-2xl shadow-lg"
      />

      <h2 className="text-2xl font-bold">{currentSong.title}</h2>
      <p className="text-gray-400">{currentSong.artist}</p>

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
        className="w-full h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full cursor-pointer"
      />
    </div>

   
    <div className="mt-auto pt-6 flex items-center justify-center gap-6">
      <button
        onClick={onPrev}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
      >
        Prev
      </button>

      <button
        onClick={onPlayPause}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button
        onClick={onNext}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
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
  </div>
);
});


export default MusicPlayer;

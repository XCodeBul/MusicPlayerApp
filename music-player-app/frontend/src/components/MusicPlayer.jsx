// components/MusicPlayer.jsx
import { useRef, useEffect } from "react";

function MusicPlayer({ currentSong, isPlaying, onPlayPause, onNext, onPrev, progress, onSeek }) {
  const audioRef = useRef(null);

  // PLAY / PAUSE + CHANGE SONG
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.play().catch(() => {
        // autoplay blocked
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  // LIVE PROGRESS UPDATE
  const handleTimeUpdate = () => {
    if (!audioRef.current || !currentSong) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    onSeek((current / duration) * 100);
  };

  // ⭐ FIXED: SEEKING ACTUALLY WORKS
  const handleSeek = (value) => {
    if (!audioRef.current || !currentSong) return;

    const duration = audioRef.current.duration || 1;
    const newTime = (value / 100) * duration;

    audioRef.current.currentTime = newTime; // ← SEEK AUDIO
    onSeek(Number(value)); // ← UPDATE UI
  };

  // No song selected
  if (!currentSong) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-[380px] flex flex-col items-center text-center gap-4">
        <div className="w-56 h-56 bg-gray-700 rounded-2xl flex items-center justify-center">
          <span className="text-gray-500">No song</span>
        </div>
        <p className="text-gray-400">Select a song to play</p>
      </div>
    );
  }

  // MAIN PLAYER UI
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-[380px] flex flex-col items-center text-center gap-4">
      <img
        src={currentSong.albumArt || "https://via.placeholder.com/224"}
        alt={currentSong.title}
        className="w-56 h-56 object-cover rounded-2xl shadow-lg"
      />

      <h2 className="text-2xl font-bold">{currentSong.title}</h2>
      <p className="text-gray-400">{currentSong.artist}</p>

      {/* SEEK BAR */}
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(e) => handleSeek(e.target.value)}
        className="w-full h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #3b82f6 ${progress}%, #374151 ${progress}%)`,
        }}
      />
      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #1d4ed8;
          border-radius: 50%;
          border: 2px solid white;
          cursor: pointer;
        }
        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #1d4ed8;
          border-radius: 50%;
          border: 2px solid white;
          cursor: pointer;
        }
      `}</style>

      {/* PLAYER CONTROLS */}
      <div className="flex items-center justify-center gap-6">
        <button onClick={onPrev} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full">
          Prev
        </button>
        <button
          onClick={onPlayPause}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={onNext} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full">
          Next
        </button>
      </div>

      {/* AUDIO ELEMENT */}
      <audio
        key={currentSong?.id}       // FIX: reloads when song changes
        ref={audioRef}
        src={currentSong?.src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />
    </div>
  );
}

export default MusicPlayer;

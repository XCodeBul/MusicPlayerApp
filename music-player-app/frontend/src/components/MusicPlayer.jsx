import { useState, useRef, useEffect } from "react";
import { songs } from "../data/songs";
import Playlist from "./PlayList";



function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // Play/pause toggle
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar update
  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((current / duration) * 100 || 0);
  };

  // Seek manually in song
  const handleSeek = (e) => {
    const newProgress = e.target.value;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (duration / 100) * newProgress;
    setProgress(newProgress);
  };

  // Go to next song
  const handleNextSong = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };

  // Go to previous song
  const handlePrevSong = () => {
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };

  // Auto play when song changes
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentSong]);

  

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-[380px] max-h-[520px] flex flex-col items-center text-center transition-transform transform  duration-300 gap-4 overflow-hidden">

      
      {/* Album cover */}
      <img
        src={currentSong.cover}
        alt={currentSong.title}
        className="w-56 h-56 object-cover rounded-2xl shadow-lg mb-6"
      />

      {/* Song info */}
      <h2 className="text-2xl font-bold">{currentSong.title}</h2>
      <p className="text-gray-400 mb-6">{currentSong.artist}</p>

      {/* Progress bar */}
     <input
         type="range"
         min="0"
         max="100"
        value={progress}
        onChange={handleSeek}
        className="w-full h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full appearance-none cursor-pointer mb-6
             accent-transparent
             hover:brightness-110
             transition-all duration-200
             "
  
/>



      <style jsx>{`
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #1d4ed8; /* blue-700 */
    border-radius: 50%;
    border: 2px solid white;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  input[type='range']::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  input[type='range']::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #1d4ed8;
    border-radius: 50%;
    border: 2px solid white;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  input[type='range']::-moz-range-thumb:hover {
    transform: scale(1.2);
  }
`}</style>




      {/* Control buttons */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrevSong}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
        >
          ⏮
        </button>

        <button
          onClick={togglePlayPause}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>

        <button
          onClick={handleNextSong}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
        >
          ⏭
        </button>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentSong.src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />
      



      {/* ✅ Playlist section */}
    <Playlist onSelectSong={(s) => { setCurrentSong(s); setIsPlaying(true); }} currentSong={currentSong} />
    </div>
    
  );
}

export default MusicPlayer;

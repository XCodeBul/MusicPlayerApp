import React, { useState, useEffect } from "react";

const Lyrics = ({ currentSong }) => {
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!currentSong?.title) return;
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/lyrics?artist=${encodeURIComponent(currentSong.artist)}&title=${encodeURIComponent(currentSong.title)}`
        );
        const data = await response.json();
        setLyrics(data.lyrics || "Lyrics not available.");
      } catch (err) {
        setLyrics("Could not load lyrics.");
      }
      setLoading(false);
    };

    fetchLyrics();
  }, [currentSong]);

  const lines = lyrics ? lyrics.split('\n').filter(line => line.trim() !== "") : [];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-purple-500/20">
        <p className="text-purple-500 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Loading Transcript...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative">
      

      <div className="flex items-baseline justify-between mb-4 shrink-0 border-b border-white/5 pb-2">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter">
            {currentSong?.title}
          </h2>
          <span className="text-sm font-bold text-purple-500/80 italic">
            by {currentSong?.artist}
          </span>
        </div>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          Lyrics
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">

        <div className="py-2 space-y-5">
          {lines.length > 0 ? (
            lines.map((line, index) => (
              <p 
                key={index}
                className="text-xl md:text-2xl font-bold leading-snug tracking-tight text-white/90 
                           hover:text-purple-400 hover:translate-x-2 transition-all duration-300 cursor-default"
              >
                {line}
              </p>
            ))
          ) : (
            <div className="h-full flex items-center justify-center opacity-20">
              <p className="uppercase tracking-widest text-xs font-bold">No Data Available</p>
            </div>
          )}
        </div>
      </div>


      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </div>
  );
};

export default Lyrics;
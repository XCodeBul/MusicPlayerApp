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
        setLyrics(data.lyrics);
      } catch (err) {
        setLyrics("Could not load lyrics.");
      }
      setLoading(false);
    };

    fetchLyrics();
  }, [currentSong]);

  if (loading) return <div className="text-gray-500 font-black animate-pulse p-10 uppercase tracking-widest text-center">Loading Lyrics...</div>;

 return (
    <div className="w-full h-full flex flex-col p-8 overflow-hidden bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 relative">
      

      <div className="mb-6 shrink-0">
        <h3 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-1 truncate">
          {currentSong?.artist || "Artist"}
        </h3>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic opacity-30 truncate">
          {currentSong?.title || "Lyrics"}
        </h2>
      </div>


      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 relative">
        {loading ? (
          <div className="text-gray-500 font-black animate-pulse py-10 uppercase tracking-widest text-center">
            Fetching Words...
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-2xl font-bold text-gray-200 leading-[1.7] tracking-tight">
            {lyrics}
          </pre>
        )}
      </div>
    </div>
  );
};

export default Lyrics;
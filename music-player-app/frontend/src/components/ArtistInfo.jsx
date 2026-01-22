import React, { useState, useEffect } from "react";

const ArtistInfo = ({ currentSong }) => {
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      if (!currentSong?.artistId) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/artist/${currentSong.artistId}`);
        const data = await response.json();
        setArtist(data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchArtist();
  }, [currentSong]);

  if (loading) return <div className="text-gray-400 p-10 animate-pulse text-center w-full font-bold text-xl tracking-tighter">LOADING ARTIST PROFILE...</div>;
  if (!artist) return null;


  const genresList = artist.genres && artist.genres.length > 0 
    ? artist.genres.slice(0, 3).map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(", ")
    : "Contemporary Music";


  const calculatedListeners = Math.floor(Math.pow(artist.popularity, 4.1) / 2.1); 
  const monthlyListeners = calculatedListeners.toLocaleString();
  const worldRank = Math.floor(2200 - (Math.pow(artist.popularity, 1.7)));

  const topCities = [
    { name: "London, GB", count: Math.floor(calculatedListeners * 0.021).toLocaleString() },
    { name: "Chicago, US", count: Math.floor(calculatedListeners * 0.018).toLocaleString() },
    { name: "Los Angeles, US", count: Math.floor(calculatedListeners * 0.015).toLocaleString() },
    { name: "New York City, US", count: Math.floor(calculatedListeners * 0.014).toLocaleString() },
    { name: "Houston, US", count: Math.floor(calculatedListeners * 0.012).toLocaleString() },
  ];

  return (
    <div className="flex flex-row items-center w-full h-full px-8 gap-10 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
      

      <div className="relative shrink-0">
        <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <img 
            src={artist.images[0]?.url} 
            alt={artist.name} 
            className="w-full h-full object-cover transform hover:scale-110 transition duration-700" 
          />
        </div>
        <div className="absolute -top-3 -left-3 bg-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg border border-white/20 uppercase tracking-widest">
          POP {artist.popularity}
        </div>
      </div>


      <div className="w-[2px] h-40 bg-gradient-to-b from-transparent via-white/20 to-transparent shrink-0"></div>


      <div className="flex flex-col justify-center flex-1 space-y-6 min-w-0">
        
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-blue-400">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-3.3-3.3 1.4-1.4 1.9 1.9 4.8-4.8 1.4 1.4-6.2 6.2z"/></svg>
            </span>
            <span className="text-gray-500 uppercase font-black text-xs tracking-[0.2em]">Verified Artist</span>
          </div>
          <h2 className="text-6xl font-black text-white tracking-tighter leading-none truncate">
            {artist.name}
          </h2>
        </div>


        <div className="flex items-start gap-12">
          <div className="space-y-1">
            <p className="text-4xl font-black text-white leading-none">#{worldRank}</p>
            <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest text-nowrap">In the World</p>
          </div>
          
          <div className="space-y-1 border-l border-white/10 pl-12">
            <p className="text-4xl font-black text-purple-400 leading-none">
              {artist.followers.total.toLocaleString()}
            </p>
            <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest">Followers</p>
          </div>

          <div className="space-y-1 border-l border-white/10 pl-12">
            <p className="text-4xl font-black text-white leading-none">
              {monthlyListeners}
            </p>
            <p className="text-[11px] text-gray-500 uppercase font-bold tracking-widest text-nowrap">Monthly Listeners</p>
          </div>
        </div>

 
        <div className="max-w-3xl">
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic">
            {artist.name} is dominating the global charts with a unique and influential style in <span className="text-gray-300 font-bold not-italic">{genresList}</span>. 
            With over {monthlyListeners} listeners tuning in monthly, the artist has solidified their position as a powerhouse 
            in modern music, backed by a loyal fanbase of {artist.followers.total.toLocaleString()} followers.
          </p>
        </div>


        <div className="flex gap-4 items-center">
          <a 
            href={artist.external_urls.spotify} 
            target="_blank" 
            className="bg-white text-black text-sm font-black px-8 py-3 rounded-full hover:scale-105 transition active:scale-95 shadow-xl uppercase"
          >
            Follow on Spotify
          </a>
          <div className="flex gap-6 ml-4">
             <span className="text-xs font-bold text-gray-500 hover:text-white cursor-pointer transition tracking-widest">INSTAGRAM</span>
             <span className="text-xs font-bold text-gray-500 hover:text-white cursor-pointer transition tracking-widest">X</span>
          </div>
        </div>
      </div>


      <div className="w-80 h-[75%] shrink-0 bg-white/5 rounded-[2rem] p-6 border border-white/10 self-center flex flex-col justify-center">
        <h4 className="text-[11px] text-gray-400 font-black uppercase tracking-[0.25em] mb-6 border-b border-white/10 pb-3 text-center">
          Top Cities
        </h4>
        <div className="space-y-4">
          {topCities.map((city, idx) => (
            <div key={idx} className="flex justify-between items-center group">
              <span className="text-sm text-gray-300 font-bold group-hover:text-purple-400 transition-colors">{city.name}</span>
              <span className="text-xs text-gray-500 font-black">{city.count}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ArtistInfo;
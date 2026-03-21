import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUserContext } from "../../contexts/AuthUserContext.jsx";

const HomePage = ({ t }) => {
  const { user } = useAuthUserContext();
  const navigate = useNavigate();

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [glowColor, setGlowColor] = useState("rgba(168, 85, 247, 0.15)");
  const audioRef = useRef(new Audio());
  const [popularTracks, setPopularTracks] = useState([]);

  const staticArtists = [
    { id: 1, name: 'Future', imageUrl: '/covers/future.webp', deezerId: '165930' },
    { id: 2, name: 'Kendrick Lamar', imageUrl: '/covers/kendrick.jpg', deezerId: '525046' },
    { id: 3, name: 'The Weeknd', imageUrl: '/covers/theweeknd.jpg', deezerId: '4050205' },
    { id: 4, name: 'Dua Lipa', imageUrl: '/covers/dualipa.webp', deezerId: '8706544' },
    { id: 5, name: 'Drake', imageUrl: '/covers/drake.jpg', deezerId: '246791' },
    { id: 6, name: 'Bruno Mars', imageUrl: '/covers/brunomars.jpeg', deezerId: '429675' },
    { id: 7, name: 'Travis Scott', imageUrl: '/covers/travis.jpg', deezerId: '4495513' },
    { id: 8, name: 'Young Thug', imageUrl: '/covers/youngthug.jpg', deezerId: '1590752' },
    { id: 9, name: 'Rihanna', imageUrl: '/covers/rihanna.jpg', deezerId: '564' },
    { id: 10, name: '21 Savage', imageUrl: '/covers/21savage.jpg', deezerId: '6853403' },
    { id: 11, name: 'Kanye West', imageUrl: '/covers/kanye.jpg', deezerId: '230' },
    { id: 12, name: 'Lil Uzi Vert', imageUrl: '/covers/liluzivert.jpg', deezerId: '7101343' },
  ];

  
  const playTrack = (trackList, index = 0) => {
    if (!trackList || index >= trackList.length) return;

    const track = trackList[index];
    const audio = audioRef.current;

    const trackData = {
      title: track.title,
      artist: track.artist.name || track.artist,
      audioUrl: track.preview,
      cover: track.album?.cover_medium || track.cover,
    };

    
    audio.pause();
    audio.oncanplaythrough = null;
    audio.onerror = null;

    audio.src = trackData.audioUrl;
    audio.load();

  
    audio.oncanplaythrough = () => {
      audio.play()
        .then(() => {
          setCurrentTrack(trackData);
          setIsPlaying(true);
          setGlowColor("rgba(168, 85, 247, 0.4)");
        })
        .catch(() => playTrack(trackList, index + 1));
    };

  
    audio.onerror = () => {
      console.warn(`Проблем с "${trackData.title}". Прескачам на следващата...`);
      playTrack(trackList, index + 1);
    };
  };

  const handleStartClick = () => {
    user ? navigate('/player') : navigate('/login');
  };

  const handleArtistClick = async (artist) => {
    try {
      const url = `https://api.deezer.com/artist/${artist.deezerId}/top?limit=15`;
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      const data = await response.json();
      const validTracks = data.data?.filter(t => t.preview) || [];
      
      if (validTracks.length > 0) {
    
        playTrack(validTracks, 0);
      }
    } catch (error) {
      console.error("Грешка при артист:", error);
    }
  };

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const promises = staticArtists.slice(0, 10).map(artist =>
          fetch(`https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com/artist/${artist.deezerId}/top?limit=10`)}`)
            .then(res => res.json())
        );

        const results = await Promise.all(promises);
        const allTracks = results.flatMap(data => data.data || []).filter(t => t.preview);
        
      
        const shuffled = allTracks
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);

        setPopularTracks(shuffled);
      } catch (error) {
        console.error("Грешка при зареждане на хитовете:", error);
      }
    };

    fetchTopTracks();
  }, []);
  return (
    <div className="flex-1 w-full flex flex-col items-center relative px-6 overflow-y-auto pt-24 pb-32 custom-scrollbar">
      
      
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center transition-colors duration-1000">
        <div 
          className="w-full max-w-[800px] h-[400px] rounded-full blur-[140px] transition-all duration-1000" 
          style={{ backgroundColor: glowColor }}
        />
      </div>

      <div className="relative z-20 text-center flex flex-col items-center max-w-5xl mb-48">
        <div className="mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-purple-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-300/90">
            {"Музикално ИЗЖИВЯВАНЕ"}
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black italic tracking-tighter text-white uppercase leading-none mb-8">
          Music<span className="text-purple-600 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">Note</span>
        </h1>
        
        <p className="text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto mb-14 opacity-80">
          {"Потопи се в ритъма на най-новите хитове. Открий любимите си изпълнители и усети музиката навсякъде и по всяко време."}
        </p>

        <button 
          onClick={handleStartClick}
          className="group relative px-20 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl transition-all duration-500 overflow-hidden hover:text-white hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] active:scale-95"
        >
          <div className="absolute inset-0 bg-purple-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
          <span className="relative z-10 italic">{"Започни да слушаш"}</span>
        </button>
      </div>

      

<div className="relative z-20 w-full max-w-7xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
  <h2 className="text-xl md:text-3xl font-black italic text-white uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">
    Популярни <span className="text-purple-500">Изпълнители</span>
  </h2>


  <div className="flex overflow-x-auto gap-6 md:gap-10 py-6 px-2 -mx-2 custom-scrollbar-hide snap-x snap-mandatory select-none">
    {staticArtists.map((artist) => (
      <div 
        key={artist.id} 
        onClick={() => handleArtistClick(artist)} 
        className="group flex flex-col items-center cursor-pointer transition-all duration-500 hover:-translate-y-2 shrink-0 snap-start"
      >

        <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 shadow-lg group-hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)] overflow-hidden transition-all duration-500">
          <img 
            src={artist.imageUrl} 
            alt={artist.name} 
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
          />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-purple-900/20 backdrop-blur-[1px]">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <span className="mt-5 text-[11px] md:text-xs font-black text-white uppercase italic group-hover:text-purple-400 transition-colors tracking-[0.15em]">
          {artist.name}
        </span>
      </div>
    ))}
  </div>
</div>

      
      {currentTrack && (
  
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-bottom-10 duration-500">
    <div className="p-3 rounded-[2rem] flex items-center gap-4 border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      
      <div className="relative shrink-0">
        <div className={`absolute inset-0 bg-purple-500/20 rounded-full blur-md ${isPlaying ? 'animate-pulse' : 'opacity-0'}`}></div>
        <img src={currentTrack.cover} alt="cover" className={`relative w-12 h-12 rounded-full border border-white/10 object-cover ${isPlaying ? 'animate-spin-slow' : ''}`} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-white text-[13px] font-black italic uppercase truncate leading-none">{currentTrack.title}</h4>
        <p className="text-purple-500/80 text-[10px] font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
          <span className={`w-1 h-1 rounded-full bg-purple-500 ${isPlaying ? 'animate-ping' : ''}`}></span>
          {currentTrack.artist}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => { isPlaying ? audioRef.current.pause() : audioRef.current.play(); setIsPlaying(!isPlaying); }}
          className="w-11 h-11 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <button onClick={() => { audioRef.current.pause(); setCurrentTrack(null); setIsPlaying(false); }} className="p-2 text-gray-500 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  </div>
)}


<div className="relative z-20 w-full max-w-7xl px-4 mt-32 mb-20">
  <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter mb-12 border-b border-white/5 pb-6">
    Топ <span className="text-purple-500">Хитове</span>
  </h2>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
    {popularTracks.map((track, index) => (
      <div 
        key={`${track.id}-${index}`}
        onClick={() => {
          const trackData = {
            title: track.title,
            artist: track.artist.name,
            audioUrl: track.preview,
            cover: track.album.cover_medium,
          };

          audioRef.current.pause();
          audioRef.current.src = trackData.audioUrl;
          audioRef.current.play();
          setCurrentTrack(trackData);
          setIsPlaying(true);
          setGlowColor("rgba(168, 85, 247, 0.4)");
        }}
        className="group flex items-center gap-4 p-2 rounded-2xl hover:bg-white/[0.03] transition-all cursor-pointer border border-transparent hover:border-white/5"
      >
        <span className="text-gray-700 font-black italic text-sm w-6 group-hover:text-purple-500">
          {(index + 1).toString().padStart(2, '0')}
        </span>
        
        <img src={track.album.cover_medium} alt="" className="w-14 h-14 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform" />

        <div className="flex-1 min-w-0">
          <h3 className="text-white text-[14px] font-black uppercase italic truncate">{track.title}</h3>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{track.artist.name}</p>
        </div>

        <div className="text-[10px] font-bold text-gray-600 tabular-nums">
          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
        </div>
      </div>
    ))}
  </div>
</div>
    </div>
  );
};
export default HomePage;
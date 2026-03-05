import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUserContext } from "../../contexts/AuthUserContext.jsx";

const HomePage = ({ t }) => {
  const { user } = useAuthUserContext();
  const navigate = useNavigate();

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [glowColor, setGlowColor] = useState("rgba(168, 85, 247, 0.15)");
  const audioRef = useRef(new Audio());

  
  const staticArtists = [
    { id: 1, name: 'Future', imageUrl: '/covers/future.webp', deezerId: '165930' },
    { id: 2, name: 'Kendrick Lamar', imageUrl: '/covers/kendrick.jpg', deezerId: '525046' },
    { id: 3, name: 'The Weeknd', imageUrl: '/covers/theweeknd.jpg', deezerId: '4050205' },
    { id: 4, name: 'Dua Lipa', imageUrl: '/covers/dualipa.webp', deezerId: '8706544' },
    { id: 5, name: 'Drake', imageUrl: '/covers/drake.jpg', deezerId: '246791' },
    { id: 6, name: 'Bruno Mars', imageUrl: '/covers/brunomars.jpeg', deezerId: '429675' },
  ];

  const handleStartClick = () => {
    user ? navigate('/player') : navigate('/login');
  };

  const handleArtistClick = async (artist) => {
    try {
      const url = `https://api.deezer.com/artist/${artist.deezerId}/top?limit=15`;
      const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
      const data = await response.json();
      const validTracks = data.data?.filter(track => track.preview && track.preview !== "") || [];
      if (validTracks.length === 0) return;

      
      const attemptPlay = (index) => {
        const track = validTracks[index];
        const newTrack = {
          title: track.title,
          artist: track.artist.name,
          audioUrl: track.preview,
          cover: track.album.cover_medium,
        };

        audioRef.current.pause();
        audioRef.current.src = newTrack.audioUrl;
        audioRef.current.load();
        audioRef.current.onerror = () => {
          
          attemptPlay(index + 1); 
        };

        
        audioRef.current.oncanplay = () => {
          audioRef.current.play()
            .then(() => {
              setCurrentTrack(newTrack);
              setIsPlaying(true);
              setGlowColor("rgba(168, 85, 247, 0.4)");
              audioRef.current.onerror = null; 
            })
            .catch(() => attemptPlay(index + 1)); 
        };
      };

     
      const randomStart = Math.floor(Math.random() * Math.min(validTracks.length, 5));
      attemptPlay(randomStart);

    } catch (error) {
      console.error("Грешка:", error);
    }
  };

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
            {"ЗВУКОВО ИЗЖИВЯВАНЕ"}
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
        <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter mb-12 border-b border-white/5 pb-6">
          Популярни <span className="text-purple-500">Изпълнители</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {staticArtists.map((artist) => (
            <div 
              key={artist.id} 
              onClick={() => handleArtistClick(artist)} 
              className="group flex flex-col items-center cursor-pointer transition-all duration-500 hover:-translate-y-3"
            >
              <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 shadow-2xl overflow-hidden">
                <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-purple-900/10">
                  <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <span className="mt-6 text-base font-black text-white uppercase italic group-hover:text-purple-400 transition-colors">{artist.name}</span>
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
    </div>
  );
};
export default HomePage;
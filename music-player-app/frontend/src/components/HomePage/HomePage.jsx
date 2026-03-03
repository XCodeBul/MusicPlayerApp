import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUserContext } from "../../contexts/AuthUserContext.jsx";

const HomePage = ({ t }) => {
  const { user } = useAuthUserContext();
  const navigate = useNavigate();

  const staticArtists = [
    { id: 1, name: 'Future', imageUrl: '/covers/future.webp' },
    { id: 2, name: 'Kendrick Lamar', imageUrl: '/covers/kendrick.jpg' },
    { id: 3, name: 'The Weeknd', imageUrl: '/covers/theweeknd.jpg' },
    { id: 4, name: 'Dua Lipa', imageUrl: '/covers/dualipa.webp' },
    { id: 5, name: 'Drake', imageUrl: '/covers/drake.jpg' },
    { id: 6, name: 'Bruno Mars', imageUrl: '/covers/brunomars.jpeg' },
  ];

  const handleStartClick = () => {
    user ? navigate('/player') : navigate('/login');
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center relative px-6 overflow-y-auto pt-24 pb-32 custom-scrollbar">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-purple-600/10 blur-[140px]" />
      </div>

      <div className="relative z-20 text-center flex flex-col items-center max-w-5xl mb-48">
        <div className="mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-purple-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-300/90">
            {t?.welcomeTag || "ЗВУКОВО ИЗЖИВЯВАНЕ"}
          </span>
        </div>

        <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black italic tracking-tighter text-white uppercase leading-none select-none mb-8">
          Music<span className="text-purple-600 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">Note</span>
        </h1>
        
        <p className="text-gray-400 font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed tracking-wide opacity-80 mb-14 px-4">
          {t?.landingSub || "Потопи се в ритъма. Открий любимите си изпълнители и изживей музиката по изцяло нов начин."}
        </p>

        <div className="flex justify-center">
          <button 
            onClick={handleStartClick}
            className="group relative px-20 py-6 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-2xl 
                       transition-all duration-500 overflow-hidden hover:text-white hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] 
                       active:scale-95 shadow-2xl"
          >
            <div className="absolute inset-0 bg-purple-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 italic">
              {t?.startListening || "Започни да слушаш"}
            </span>
          </button>
        </div>
      </div>

      <div className="relative z-20 w-full max-w-7xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-6">
          <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter">
            Популярни <span className="text-purple-500">Изпълнители</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-10">
          {staticArtists.map((artist) => (
            <div key={artist.id} className="group flex flex-col items-center cursor-pointer transition-all duration-500 hover:-translate-y-3">
              <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 shadow-2xl transition-all duration-500 overflow-hidden">
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name} 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-purple-900/10">
                   <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                   </div>
                </div>
              </div>

              <span className="mt-6 text-base font-black text-white uppercase tracking-tighter italic group-hover:text-purple-400 transition-colors text-center">
                {artist.name}
              </span>
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
                Изпълнител
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
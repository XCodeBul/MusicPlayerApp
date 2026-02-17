import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import Sidebar from "./components/Sidebar";
import Visualizer from "./components/Visualizer";
import ArtistInfo from "./components/ArtistInfo";
import Lyrics from "./components/Lyrics"; 
import LoginForm from "./components/LoginForm";
import "./index.css";
import { supabase } from "./supabaseClient";

export default function App() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchPanelRef = useRef(null);
  const musicAudioRef = useRef(null);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleUpdatePlaylistCover = (playlistId, newCover) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, cover: newCover } : p))
    );
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist((prev) => ({ ...prev, cover: newCover }));
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const filteredResults = (data.tracks?.items || []).filter(
          (track) => track.preview_url !== null
        );
        setSearchResults(filteredResults);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
      setSearchLoading(false);
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [searchQuery]);

  useEffect(() => {
    const syncToken = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/token");
        if (!res.ok) throw new Error("Server error " + res.status);
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem("spotify_access_token", data.access_token);
          console.log("✅ Spotify Token Synced Successfully!");
        }
      } catch (err) {
        console.error("❌ Token sync error:", err);
      }
    };
    syncToken();
  }, []);

  const formatDuration = (ms) => {
    const mins = Math.floor(ms / 60000);
    const secs = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleCreatePlaylist = async (name) => {
   
    const { data: { session } } = await supabase.auth.getSession();
    const activeUserId = session?.user?.id || user?.id;

    if (!activeUserId) {
      console.error("Creation blocked: No active User ID found.");
      alert("Session expired. Please log in again.");
      setIsAuthOpen(true);
      return;
    }

    const { data, error } = await supabase
      .from('playlists')
      .insert([{ 
        name: name, 
        user_id: activeUserId, 
        songs: [] 
      }])
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      alert("Error: " + error.message);
    } else if (data) {
      setPlaylists((prev) => [...prev, ...data]);
    }
  };

  const handleAddToPlaylist = async (track, playlistId) => {
    if (!track.preview_url) {
      alert(`"${track.name}" by ${track.artists[0].name} has no preview available`);
      return;
    }

    const newSong = {
      id: track.id,
      title: track.name,
      artist: track.artists[0].name,
      artistId: track.artists[0].id,
      duration: "30s",
      albumArt: track.album.images[1]?.url || track.album.images[0]?.url || null,
      src: track.preview_url,
    };

    const targetPlaylist = playlists.find((p) => p.id === playlistId);
    const updatedSongs = [...(targetPlaylist?.songs || []), newSong];

    const { error } = await supabase
      .from("playlists")
      .update({ songs: updatedSongs })
      .eq("id", playlistId);

    if (error) {
      console.error("Error adding song to Supabase:", error.message);
      alert("Could not save song to database.");
      return;
    }

    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, songs: updatedSongs } : p))
    );

    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist((prev) => ({ ...prev, songs: updatedSongs }));
    }
    setShowPlaylistPicker(null);
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
  };

  const handlePlayPause = () => setIsPlaying((prev) => !prev);

  const handleNext = () => {
    if (!selectedPlaylist || selectedPlaylist.songs.length === 0) return;
    const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id);
    const next = selectedPlaylist.songs[(idx + 1) % selectedPlaylist.songs.length];
    playSong(next);
  };

  const handlePrev = () => {
    if (!selectedPlaylist || selectedPlaylist.songs.length === 0) return;
    const idx = selectedPlaylist.songs.findIndex((s) => s.id === currentSong?.id);
    const prev = selectedPlaylist.songs[(idx - 1 + selectedPlaylist.songs.length) % selectedPlaylist.songs.length];
    playSong(prev);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      
      setUser(null);
      setPlaylists([]);
      setSelectedPlaylist(null);

      
      setCurrentSong(null);
      setIsPlaying(false);

      
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
        musicAudioRef.current.src = "";
        musicAudioRef.current.load(); 

      }
      console.log("UI Cleaned");
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        updateUserInfo(session.user);
        fetchUserPlaylists(session.user.id);
      }
    };

    const updateUserInfo = (supabaseUser) => {
      setUser({
        id: supabaseUser.id,
        name: supabaseUser.user_metadata?.full_name || "User",
        email: supabaseUser.email,
        avatar: supabaseUser.user_metadata?.avatar_url,
      });
    };

    const fetchUserPlaylists = async (userId) => {
      const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
      if (data) setPlaylists(data);
      if (error) console.error("Playlist fetch error:", error);
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Supabase Auth Event:", event);
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          updateUserInfo(session.user);
          fetchUserPlaylists(session.user.id);
          setIsAuthOpen(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setPlaylists([]);
        setSelectedPlaylist(null);
        setCurrentSong(null);
        setIsPlaying(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDeletePlaylist = async (e, playlistId) => {
  e.stopPropagation();
  
  if (!window.confirm("Are you sure you want to delete this playlist permanently?")) return;

  try {
    
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId); 

    if (error) {
      throw error;
    }

    
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
    
    console.log("Playlist deleted successfully from Database and UI");
  } catch (error) {
    console.error("Delete failed:", error.message);
    alert("Database error: " + error.message);
  }
};

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col overflow-hidden font-sans">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearchFocused={isSearchFocused}
        setIsSearchFocused={setIsSearchFocused}
        searchPanelRef={searchPanelRef}
        onLoginClick={() => setIsAuthOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        
        <aside className="hidden md:flex w-20 lg:w-24 bg-gray-900/50 rounded-3xl flex-col shadow-xl ml-4 my-4 flex-shrink-0">
          <Sidebar
            playlists={playlists}
            onCreatePlaylist={handleCreatePlaylist}
            onUpdatePlaylistCover={handleUpdatePlaylistCover}
            onSelectPlaylist={setSelectedPlaylist}
            onDeletePlaylist={handleDeletePlaylist}
          />
        </aside>

        
        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
          

<div className="flex flex-row items-stretch flex-shrink-0 w-full overflow-hidden">
  
  
  <div className="scale-90 origin-top-left shrink-0">
    <MusicPlayer
      ref={musicAudioRef}
      currentSong={currentSong}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onNext={handleNext}
      onPrev={handlePrev}
      progress={progress}
      onSeek={(newProgress) => setProgress(newProgress)}
    />
  </div>


 <div className="flex-1 -ml-6 py-[1.9%] -mt-9 flex flex-col transition-all duration-300 min-w-0"> 
  
  <div className="bg-gray-900/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20 shadow-2xl flex-1 flex flex-col justify-center overflow-hidden relative">
    

    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

    {currentSong ? (
      <ArtistInfo currentSong={currentSong} />
    ) : (
      <div className="flex-1 flex flex-row items-center justify-center text-center gap-6">
        
        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-3xl border border-purple-500/20 shadow-inner shrink-0 grayscale opacity-40">
          👤
        </div>
        <div className="text-left">
          
          <h3 className="text-purple-500/50 font-black text-[10px] uppercase tracking-[0.4em] mb-1">
            System Detail
          </h3>
          <h2 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">
            Artist Details
          </h2>
          <p className="text-gray-500 text-xs font-medium">
            Select a track for full biography and stats
          </p>
        </div>
      </div>
    )}
  </div>
</div>

</div> 


<div className="flex-1 flex flex-col -mt-4 mb-4 overflow-hidden">
  <div className="flex-1 flex gap-5 overflow-hidden">
    
   
    <div className="w-full max-w-2xl flex-1 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-purple-500/20 shadow-2xl overflow-y-auto custom-scrollbar relative">
  

  <div className="mb-8 flex items-center justify-between shrink-0">
    <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
      <span className="text-purple-500 opacity-50">#</span>
      {selectedPlaylist ? selectedPlaylist.name : "Your Queue"}
    </h3>
    <span className="text-[10px] font-black text-purple-500/40 uppercase tracking-[0.3em]">
      {selectedPlaylist?.songs?.length || 0} Tracks
    </span>
  </div>

  {selectedPlaylist && selectedPlaylist.songs.length > 0 ? (
    <ul className="space-y-3">
      {selectedPlaylist.songs.map((song) => (
        <li
          key={song.id}
          onClick={() => playSong(song)}
          className={`flex items-center gap-5 p-4 rounded-2xl cursor-pointer transition-all duration-300 group border ${
            currentSong?.id === song.id
              ? "bg-purple-600/20 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
              : "bg-white/5 border-transparent hover:bg-white/10 hover:border-purple-500/10"
          }`}
        >
          
          <div className="relative">
            {song.albumArt ? (
              <img src={song.albumArt} className="w-12 h-12 rounded-xl shadow-lg group-hover:scale-105 transition-transform object-cover" alt="" />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-900 rounded-xl flex items-center justify-center text-xl shadow-lg">
                🎵
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`font-bold truncate transition-colors ${
              currentSong?.id === song.id ? "text-purple-300" : "text-gray-200 group-hover:text-purple-400"
            }`}>
              {song.title}
            </p>
            <p className="text-sm text-gray-500 font-medium truncate italic">{song.artist}</p>
          </div>

          <div className="flex items-center gap-3">
            
            {currentSong?.id === song.id && (
              <div className="flex gap-[2px] items-end h-3">
                <div className="w-[2px] bg-purple-500 animate-[bounce_1s_infinite_0.1s] h-full"></div>
                <div className="w-[2px] bg-purple-500 animate-[bounce_1.2s_infinite_0.3s] h-2/3"></div>
                <div className="w-[2px] bg-purple-500 animate-[bounce_0.8s_infinite_0.2s] h-1/2"></div>
              </div>
            )}
            <span className="text-[10px] text-purple-400 font-black tracking-widest opacity-50 uppercase">30s</span>
          </div>
        </li>
      ))}
    </ul>
  ) : (
     
    <div className="text-center py-24 flex flex-col items-center justify-center opacity-40">
      <div className="w-16 h-16 rounded-full border border-purple-500/20 flex items-center justify-center mb-4">
        <span className="text-2xl grayscale">🎶</span>
      </div>
      <p className="text-purple-500 text-[10px] font-black uppercase tracking-[0.4em]">Queue Empty</p>
      <p className="mt-2 text-gray-600 text-[10px] font-medium uppercase tracking-widest">Awaiting Input Signal</p>
    </div>
  )}

  
  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
</div>


<div className="w-[400px] flex-shrink-0 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] p-6 border border-purple-500/20 shadow-2xl flex items-center justify-center overflow-hidden relative group">
  
 
  <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

  {user && currentSong ? (
    <Visualizer audioRef={musicAudioRef} currentSong={currentSong} />
  ) : (
    <div className="text-center relative z-10">
      <div className="flex flex-col items-center gap-2">
        <span className="text-purple-500/40 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
          Signal Offline
        </span>
        <div className="text-gray-600 font-bold tracking-widest text-xs">
          SYSTEM IDLE
        </div>
      </div>
    </div>
  )}

  
  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
</div>


    <div className="flex-1 min-w-[300px] flex flex-col overflow-hidden">
  {currentSong ? (
    <Lyrics currentSong={currentSong} />
  ) : (
  
    <div className="flex-1 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-purple-500/20 shadow-2xl flex items-center justify-center relative overflow-hidden group">
      
   
      <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="text-center relative z-10">
        <div className="text-3xl mb-4 opacity-20 filter grayscale hover:grayscale-0 transition-all duration-700">
          📝
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-purple-500/40 text-[10px] font-black uppercase tracking-[0.4em]">
            System Standby
          </p>
          <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">
            Lyrics Off-line
          </p>
        </div>
      </div>

      
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </div>
  )}
</div>

  </div>
</div>
        </div>
      </div>

      
      {isSearchFocused && (
        <>
          <div
            className="fixed inset-0 z-[999998] bg-black/20 backdrop-blur-sm"
            onClick={() => setIsSearchFocused(false)}
          />
          <div
            ref={searchPanelRef}
            onClick={(e) => e.stopPropagation()}
            className="fixed left-1/2 top-28 -translate-x-1/2 w-full max-w-2xl 
                       bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl 
                       border border-gray-700/50 overflow-hidden
                       z-[999999] animate-in slide-in-from-top-4 duration-300"
          >
            <div className="flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-gray-700/50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to listen to?"
                autoFocus
                className="flex-1 bg-transparent text-white text-lg outline-none placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="text-gray-500 hover:text-white transition"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {searchLoading ? (
                <div className="py-20 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                  <p className="mt-4 text-gray-400">Searching Spotify...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-4 space-y-2">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="relative group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-200 cursor-default"
                    >
                      {track.album.images[2]?.url ? (
                        <img src={track.album.images[2].url} alt="" className="w-14 h-14 rounded-xl shadow-lg flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                          🎵
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{track.name}</p>
                        <p className="text-sm text-gray-400 truncate">{track.artists.map(a => a.name).join(", ")}</p>
                      </div>
                      <span className="text-sm text-gray-500 px-3">{formatDuration(track.duration_ms)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPlaylistPicker(track.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 
                                   hover:from-green-400 hover:to-emerald-400 rounded-full flex items-center justify-center
                                   text-2xl font-bold shadow-xl transition-all duration-300 transform hover:scale-110"
                      >
                        +
                      </button>
                      
                      {showPlaylistPicker === track.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-12 top-16 bg-gray-800/98 backdrop-blur-xl rounded-2xl 
                                     shadow-2xl border border-gray-600 z-[9999999] min-w-[200px] py-2 overflow-hidden"
                        >
                          <p className="px-6 py-2 text-xs uppercase tracking-wider text-gray-500 font-bold">
                            Add to playlist
                          </p>
                          {playlists.length > 0 ? (
                            playlists.map((p) => (
                              <div
                                key={p.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToPlaylist(track, p.id);
                                }}
                                className="px-6 py-3 hover:bg-purple-600/20 cursor-pointer text-sm 
                                           flex items-center gap-3 transition"
                              >
                                {p.cover ? <img src={p.cover} className="w-8 h-8 rounded" alt="" /> : <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-[10px]">PL</div>}
                                <span className="truncate">{p.name}</span>
                              </div>
                            ))
                          ) : (
                            <p className="px-6 py-3 text-sm text-gray-400 italic">No playlists found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="py-20 text-center text-gray-500">
                  <p className="text-xl">No results found</p>
                </div>
              ) : (
                <div className="py-20 text-center text-gray-500">
                  <p className="text-xl">Start typing to search songs</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    
      <footer className="hidden sm:flex bg-gray-900/40 backdrop-blur-2xl px-12 py-5 border-t border-purple-500/20 flex-shrink-0 relative transition-colors duration-700">
 
  <div className={`absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-1000 ${
    isPlaying ? "bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-100" : "bg-white/5 opacity-50"
  }`} />

  <div className="max-w-7xl mx-auto flex items-center justify-between relative z-10">
    
   
    <div className="flex items-center gap-4">
      <div className="flex items-end gap-[3px] h-4">
       
        {[0.1, 0.3, 0.2, 0.5].map((delay, i) => (
          <div 
            key={i}
            className={`w-1 rounded-full transition-all duration-500 ${
              isPlaying 
                ? "bg-purple-500 shadow-[0_0_8px_#A855F7] animate-bounce" 
                : "bg-gray-700 h-1"
            }`}
            style={{ 
              animationDelay: `${delay}s`,
              height: isPlaying ? (i % 2 === 0 ? '60%' : '100%') : '4px'
            }}
          />
        ))}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all duration-700 ${
        isPlaying ? "text-purple-500" : "text-gray-600 opacity-40"
      }`}>
        {isPlaying ? "Signal Processor Active" : "Core Idle"}
      </span>
    </div>

    
    <div className={`flex items-center gap-10 transition-all duration-1000 ${
      isPlaying ? "opacity-100 blur-0" : "opacity-30 blur-[1px]"
    }`}>
      <div className="flex flex-col items-end border-r border-purple-500/10 pr-10">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-500/40 mb-1">Local Time</span>
        <span className="text-sm font-bold text-white tabular-nums tracking-widest uppercase italic">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-500/40 mb-1">System Date</span>
        <span className="text-sm font-bold text-white tracking-widest uppercase italic">
          {new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>

  </div>
</footer>

<LoginForm 
      isOpen={isAuthOpen} 
      onClose={() => setIsAuthOpen(false)}
      
    />


    </div>
  );
}
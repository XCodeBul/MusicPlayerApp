import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function LoginForm({ isOpen, onClose, onSuccess , t }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error("Google Auth Error:", error.message);
  };

  const handleEmailAuth = async () => {
    alert("Email auth requires state variables. Use Google for the fastest test!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
  
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />

  
      <div className="relative w-full max-w-md bg-gray-950 border border-purple-500/20 rounded-[3rem] p-12 shadow-[0_0_80px_-20px_rgba(168,85,247,0.2)] animate-in zoom-in-95 duration-300 overflow-hidden">
        

        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[100px] pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex w-16 h-16 bg-transparent border-2 border-purple-500/40 rounded-2xl items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)] group hover:border-purple-400 transition-colors">
            <span className="text-purple-400 text-4xl font-light">♪</span>
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">
          {isLogin ? t.systemLogin : t.initAccount}
          </h2>

           <p className="text-purple-500/50 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
           {isLogin ? t.verifyIdentity : t.establishSignal}
           </p>
          </div>


        <div className="space-y-4 relative z-10">
          <div className="group">
            <input 
              type="email" 
              placeholder={t.emailPlaceholder}
              className="w-full bg-white/5 border border-purple-500/10 rounded-2xl px-6 py-4 text-white outline-none focus:bg-purple-900/10 focus:border-purple-500/50 transition-all duration-300 placeholder-purple-900 font-mono text-sm"
            />
          </div>
          
          <div className="group">
            <input 
              type="password" 
              placeholder={t.passPlaceholder}
              className="w-full bg-white/5 border border-purple-500/10 rounded-2xl px-6 py-4 text-white outline-none focus:bg-purple-900/10 focus:border-purple-500/50 transition-all duration-300 placeholder-purple-900 font-mono text-sm"
            />
          </div>

          <button 
  onClick={handleEmailAuth}
  className="w-full bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-600 hover:text-white font-black py-4 rounded-2xl mt-4 shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all active:scale-95 uppercase text-xs tracking-[0.3em]"
>
  {isLogin ? t.executeEntry : t.finalizeConfig}
</button>
        </div>

  
        <div className="flex items-center my-10 gap-4 relative z-10">
          <div className="h-[1px] flex-1 bg-purple-500/10"></div>
          <span className="text-[9px] font-black text-purple-900 uppercase tracking-[0.4em]">{t.externalLinks}</span>
          <div className="h-[1px] flex-1 bg-purple-500/10"></div>
        </div>


        <div className="grid grid-cols-2 gap-4 relative z-10">
          <button 
            onClick={handleEmailAuth}
            className="flex items-center justify-center gap-3 bg-white/5 border border-purple-500/10 hover:border-purple-500/40 py-3 rounded-2xl transition-all group"
          >
            <span className="text-xs font-black text-purple-300/40 group-hover:text-purple-400 uppercase tracking-widest transition-colors">Spotify</span>
          </button>
          <button 
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white/5 border border-purple-500/10 hover:border-purple-500/40 py-3 rounded-2xl transition-all group"
          >
            <span className="text-xs font-black text-purple-300/40 group-hover:text-purple-400 uppercase tracking-widest transition-colors">Google</span>
          </button>
        </div>


        <div className="mt-12 flex justify-center relative z-10">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="group relative flex flex-col items-center gap-1 transition-all duration-300"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600 group-hover:text-purple-500 transition-colors">
            {isLogin ? t.needId : t.alreadyVerified}
            </span>

            <span className="text-xs font-black uppercase tracking-[0.2em] text-white border-b border-purple-500/50 group-hover:border-purple-500 transition-all">
            {isLogin ? t.createAccount : t.returnLogin}
           </span>
          </button>
        </div>
      </div>
    </div>
  );
}
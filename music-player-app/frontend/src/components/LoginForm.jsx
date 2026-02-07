import { useState } from "react";

export default function LoginForm({ isOpen, onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthAction = () => {
    const mockUser = {
      name: "Alex Design",
      email: "alex@example.com",
      avatar: null
    };
    
    if (onSuccess) {
      onSuccess(mockUser); 
      console.log("✅ Login successful!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000000] flex items-center justify-center p-4">
      {/* Heavy frosted glass backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Main Form Card */}
      <div className="relative w-full max-w-md bg-gray-900/40 backdrop-blur-3xl rounded-[2.5rem] p-10 border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl items-center justify-center mb-4 shadow-xl shadow-blue-500/20">
            <span className="text-white text-3xl font-bold">♪</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-gray-500 text-sm mt-1 tracking-wide">
            {isLogin ? "Access your personalized rhythm" : "Join the lossless revolution"}
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="group">
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:bg-white/10 focus:border-blue-500/50 transition-all duration-300 placeholder-gray-600"
            />
          </div>
          
          <div className="group">
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white outline-none focus:bg-white/10 focus:border-purple-500/50 transition-all duration-300 placeholder-gray-600"
            />
          </div>

          <button 
            onClick={handleAuthAction}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl mt-2 shadow-lg shadow-purple-500/20 transition-all active:scale-95"
          >
            {isLogin ? "CONTINUE" : "START LISTENING"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-8 gap-4">
          <div className="h-[1px] flex-1 bg-white/10"></div>
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">Or connect with</span>
          <div className="h-[1px] flex-1 bg-white/10"></div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={handleAuthAction}
            className="flex items-center justify-center gap-3 bg-white/5 border border-white/5 hover:bg-white/10 py-3 rounded-2xl transition-colors"
          >
            <span className="text-lg">🎧</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Spotify</span>
          </button>
          <button 
            onClick={handleAuthAction}
            className="flex items-center justify-center gap-3 bg-white/5 border border-white/5 hover:bg-white/10 py-3 rounded-2xl transition-colors"
          >
            <span className="text-lg text-red-500 font-bold">G</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Google</span>
          </button>
        </div>

        {/* Toggle Login/Signup */}
      {/* Toggle Login/Signup - UPDATED BOX */}
        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="group relative flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">
              {isLogin ? "New to MusicNote?" : "Already a member?"}
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-white border-b-2 border-blue-500 pb-0.5">
              {isLogin ? "Register" : "Login"}
            </span>
            
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
}
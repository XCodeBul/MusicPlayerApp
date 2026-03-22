import { useState } from "react"
import { API_BASE_URL } from "../../config/app.js"
import { useLocalizationContext } from "../../contexts/LocalizationContext.jsx"

const SUGGESTIONS = [
    "Relaxing evening at home",
    "Workout motivation",
    "Sad rainy day",
    "Road trip with friends",
    "Focus and deep work",
    "Party at night",
    "Morning coffee vibes",
    "Heartbreak and healing",
]

export default function AIPlaylistPage() {
    const { language } = useLocalizationContext()
    const [prompt, setPrompt] = useState("")
    const [playlist, setPlaylist] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [generated, setGenerated] = useState(false)

    const handleGenerate = async () => {
        if (!prompt.trim()) return
        setLoading(true)
        setError("")
        setPlaylist([])
        setGenerated(false)

        try {
            const res = await fetch(`${API_BASE_URL}/api/ai/playlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt.trim() }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Something went wrong.")
            setPlaylist(data.playlist)

            setGenerated(true)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSuggestion = (s) => {
        setPrompt(s)
        setGenerated(false)
        setPlaylist([])
        setError("")
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleGenerate()
        }
    }

    return (
        <div className="flex-1 overflow-y-auto bg-black flex flex-col items-center px-4 py-12 custom-scrollbar">

            {/* Header */}
            <div className="text-center mb-10 max-w-2xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center
                        shadow-[0_0_25px_rgba(168,85,247,0.5)] border border-purple-400/30">
                        <span className="text-2xl">✦</span>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter bg-gradient-to-r
                        from-white via-purple-200 to-purple-400 bg-clip-text text-transparent italic">
                        AI Playlist
                    </h1>
                </div>
                <p className="text-gray-500 text-sm font-medium tracking-wide">
                    {language === "BG"
                        ? "Опиши настроение, дейност или тема — Claude ще генерира плейлист за теб."
                        : "Describe a mood, activity, or theme — Claude will generate a playlist for you."}
                </p>
            </div>

            {/* Input card */}
            <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 mb-6">
                <p className="text-[10px] font-black text-purple-400/60 uppercase tracking-[0.2em] mb-3">
                    {language === "BG" ? "Въведи описание" : "Describe your playlist"}
                </p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={500}
                    placeholder={
                        language === "BG"
                            ? "Напр: тъжна дъждовна вечер, мотивация за тренировка..."
                            : "e.g. sad rainy evening, workout motivation, chill focus session..."
                    }
                    rows={3}
                    className="w-full bg-white/5 border border-purple-500/20 text-white rounded-2xl px-5 py-4
                        text-sm outline-none resize-none placeholder-gray-600 font-medium
                        focus:border-purple-500/50 focus:bg-purple-900/10 transition-all duration-300
                        focus:shadow-[0_0_20px_rgba(168,85,247,0.1)] custom-scrollbar"
                />
                <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] text-gray-600 font-medium">{prompt.length}/500</span>
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !prompt.trim()}
                        className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest
                            transition-all duration-300 active:scale-95
                            ${loading || !prompt.trim()
                                ? "bg-purple-500/10 text-purple-400/30 border border-purple-500/10 cursor-not-allowed"
                                : "bg-purple-600 text-white border border-purple-400/30 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                {language === "BG" ? "Генерира..." : "Generating..."}
                            </>
                        ) : (
                            <>
                                <span>✦</span>
                                {language === "BG" ? "Генерирай" : "Generate"}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Suggestions */}
            {!generated && !loading && (
                <div className="w-full max-w-2xl mb-8">
                    <p className="text-[10px] font-black text-purple-400/40 uppercase tracking-[0.2em] mb-3">
                        {language === "BG" ? "Идеи" : "Try these"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSuggestion(s)}
                                className="px-4 py-2 rounded-xl bg-purple-500/5 border border-purple-500/15
                                    text-gray-400 hover:text-white hover:bg-purple-500/15 hover:border-purple-500/30
                                    text-xs font-semibold transition-all duration-200"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="w-full max-w-2xl mb-6 px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            {/* Playlist results */}
            {generated && playlist.length > 0 && (
                <div className="w-full max-w-2xl glass-panel rounded-3xl">
                    <div className="px-6 py-5 border-b border-purple-500/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-purple-400/60 uppercase tracking-[0.2em] mb-1">
                                {language === "BG" ? "Генериран плейлист" : "Generated Playlist"}
                            </p>
                            <p className="text-white font-black text-base uppercase tracking-tight italic truncate max-w-[280px]">
                                {prompt}
                            </p>
                        </div>
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-xl font-black tracking-widest">
                            {playlist.length} {language === "BG" ? "ПЕСНИ" : "SONGS"}
                        </span>
                    </div>

                    <ul className="divide-y divide-purple-500/5">
                        {playlist.map((song, i) => (
                            <li
                                key={i}
                                className="flex items-center gap-4 px-6 py-4 hover:bg-purple-500/5 transition-colors group"
                            >
                                <span className="w-6 text-center text-[11px] font-black text-purple-400/40 group-hover:text-purple-400 transition-colors shrink-0">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/15
                                    flex items-center justify-center text-lg shrink-0
                                    group-hover:bg-purple-500/20 transition-colors">
                                    ♪
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-black text-sm uppercase tracking-tight truncate">
                                        {song.title}
                                    </p>
                                    <p className="text-purple-400/60 text-xs font-semibold truncate mt-0.5">
                                        {song.artist}
                                    </p>
                                </div>
                                <a
                                    href={`https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5
                                        rounded-xl bg-green-500/10 border border-green-500/20 text-green-400
                                        text-[10px] font-black uppercase tracking-widest hover:bg-green-500/20 shrink-0"
                                >
                                    Spotify
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="px-6 py-4 border-t border-purple-500/10 flex justify-end">
                        <button
                            onClick={() => { setGenerated(false); setPlaylist([]); setPrompt("") }}
                            className="text-[10px] font-black text-purple-400/40 hover:text-purple-400 uppercase tracking-widest transition-colors"
                        >
                            {language === "BG" ? "← Нов плейлист" : "← New Playlist"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

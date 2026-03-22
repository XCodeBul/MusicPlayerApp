import {staticArtists} from "../../../config/topArtists.js";
import React from "react";
import {useLocalizationContext} from "../../../contexts/LocalizationContext.jsx";

const PopularArtists = ({playTrack}) => {
    const { t } = useLocalizationContext()
    const home = t?.home

    const handleArtistClick = async (artist) => {
        try {
            const url = `https://api.deezer.com/artist/${artist.deezerId}/top?limit=15`
            const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`)
            const data = await response.json()
            const validTracks = data.data?.filter(t => t.preview) || []

            if (validTracks.length > 0) {
                playTrack(validTracks, 0)
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="relative z-20 w-full max-w-7xl px-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h2 className="text-xl md:text-3xl font-black italic text-white uppercase tracking-tighter mb-8 border-b
                border-white/5 pb-4">
                {home.popularArtists} <span className="text-purple-500">{home.popularArtistsSpan}</span>
            </h2>

            <div className="flex overflow-x-auto gap-6 md:gap-[21px] py-6 px-2 -mx-2 custom-scrollbar-hide snap-x
                    snap-mandatory select-none">
                {staticArtists.map((artist) => (
                    <div
                        key={artist.id}
                        onClick={() => handleArtistClick(artist)}
                        className="group flex flex-col items-center cursor-pointer transition-all duration-500
                            hover:-translate-y-2 shrink-0 snap-start"
                    >
                        <div
                            className="relative w-28 h-28 md:w-40 md:h-40 rounded-full bg-white/[0.03] border
                                border-white/10 flex items-center justify-center group-hover:border-purple-500/50
                                shadow-lg group-hover:shadow-[0_15px_40px_rgba(168,85,247,0.2)] overflow-hidden
                                transition-all duration-500">
                            <img
                                src={artist.imageUrl}
                                alt={artist.name}
                                className="w-full h-full rounded-full object-cover grayscale-[20%]
                                    group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            />

                            <div className="absolute inset-0 flex items-center justify-center opacity-0
                                    group-hover:opacity-100 transition-all bg-purple-900/20 backdrop-blur-[1px]">
                                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center
                                    shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform
                                    duration-500">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <span className="mt-5 text-[11px] md:text-xs font-black text-white uppercase italic
                            group-hover:text-purple-400 transition-colors tracking-[0.15em]">
                           {artist.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PopularArtists

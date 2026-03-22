import React, {useEffect, useState} from "react";
import {useLocalizationContext} from "../../../contexts/LocalizationContext.jsx";
import {staticArtists} from "../../../config/topArtists.js";

const TopHits = ({playTrack}) => {
    const { t } = useLocalizationContext()
    const home = t?.home
    const [popularTracks, setPopularTracks] = useState([])

    useEffect(() => {
        fetchTopTracks()
    }, [])

    const fetchTopTracks = async () => {
        try {
            const promises = staticArtists.map(artist =>
                fetch(`https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com/artist/${artist.deezerId}/top?limit=10`)}`)
                    .then(res => res.json())
            )
            const results = await Promise.all(promises);
            const allTracks = results.flatMap(data => data.data || []).filter(t => t.preview);

            const shuffled = allTracks
                .sort(() => Math.random() - 0.5)
                .slice(0, 20)

            setPopularTracks(shuffled)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="relative z-20 w-full max-w-7xl px-4 mt-32 mb-20">
            <h2 className="text-2xl md:text-4xl font-black italic text-white uppercase tracking-tighter mb-12 border-b
                border-white/5 pb-6">
                {home.topHits}<span className="text-purple-500"> {home.topHitsSpan}</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                {popularTracks.map((track, index) => (
                    <div
                        key={`${track.id}-${index}`}
                        onClick={() => playTrack([track])}
                        className="group flex items-center gap-4 p-2 rounded-2xl hover:bg-white/[0.03] transition-all
                            cursor-pointer border border-transparent hover:border-white/5"
                    >
                            <span className="text-gray-700 font-black italic text-sm w-6 group-hover:text-purple-500">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                        <img src={track.album.cover_medium} alt=""
                             className="w-14 h-14 rounded-lg object-cover shadow-lg group-hover:scale-105
                                transition-transform"/>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white text-[14px] font-black uppercase italic truncate">
                                {track.title}
                            </h3>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                {track.artist.name}
                            </p>
                        </div>

                        <div className="text-[10px] font-bold text-gray-600 tabular-nums">
                            {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopHits

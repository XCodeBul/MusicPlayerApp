import {useEffect, useRef, useState} from "react";
import TrackItem from "./TrackItem/TrackItem.jsx";
import {useLocalization} from "../../../hooks/useLocalization.js";

const TrackSearch = ({isSearchFocused, setIsSearchFocused}) => {
    const {t} = useLocalization()
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [showPlaylistPicker, setShowPlaylistPicker] = useState(null)

    const searchPanelRef = useRef(null)

    // TODO: for refactoring
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            return
        }
        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            setSearchLoading(true)
            try {
                const res = await fetch(
                    `http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`,
                    {signal: controller.signal}
                )
                const data = await res.json();
                const filteredResults = (data.tracks?.items || []).filter(
                    (track) => track.preview_url !== null
                )
                setSearchResults(filteredResults)
            } catch (err) {
                if (err.name !== "AbortError") console.error(err)
            }
            setSearchLoading(false);
        }, 400)

        return () => {
            clearTimeout(timeout)
            controller.abort()
        }
    }, [searchQuery])

    return (
        <>
            {isSearchFocused && (
                <>
                    <div
                        className="fixed inset-0 z-[999998] bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsSearchFocused(false)}
                    />
                    <div
                        ref={searchPanelRef}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed left-1/2 top-28 -translate-x-1/2 lg:w-full w-[90%] max-w-2xl
                           bg-gray-900/95 backdrop-blur-3xl rounded-3xl shadow-2xl
                           border border-gray-700/50 overflow-hidden
                           z-[999999] animate-in slide-in-from-top-4 duration-300"
                    >
                        <div className="flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-purple-900/20
                            to-blue-900/20 border-b border-gray-700/50">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.searchLong}
                                autoFocus
                                className="flex-1 bg-transparent text-white text-lg outline-none placeholder-gray-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('')
                                        setSearchResults([])
                                    }}
                                    className="text-gray-500 hover:text-white transition"
                                >
                                    {t.clear}
                                </button>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {searchLoading ? (
                                <div className="py-20 text-center">
                                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2
                                    border-b-2 border-purple-500"></div>
                                    <p className="mt-4 text-gray-400">{t.searching}</p>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <TrackItem
                                    searchResults={searchResults}
                                    showPlaylistPicker={showPlaylistPicker}
                                    setShowPlaylistPicker={setShowPlaylistPicker}
                                />
                            ) : searchQuery.trim() ? (
                                <div className="py-20 text-center text-gray-500">
                                    <p className="text-xl">{t.noResults}</p>
                                </div>
                            ) : (
                                <div className="py-20 text-center text-gray-500">
                                    <p className="text-xl">{t.startTyping}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default TrackSearch

import { useEffect, useRef, useState } from "react";
import TrackItem from "./TrackItem/TrackItem.jsx";
import { useLocalizationContext } from "../../../contexts/LocalizationContext.jsx";
import { getTracks } from "../../../services/playlist.js";

const TrackSearch = ({ isSearchFocused, setIsSearchFocused, searchQuery, setSearchQuery }) => {
    const { t } = useLocalizationContext();
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showPlaylistPicker, setShowPlaylistPicker] = useState(null);

    const searchPanelRef = useRef(null);

    // Търсене с Debounce и AbortController
    useEffect(() => {
        const controller = new AbortController();
        if (!searchQuery || !searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setSearchLoading(true);
            getTracks(controller.signal, searchQuery)
                .then(data => setSearchResults(data))
                .catch(err => {
                    if (err.name !== 'AbortError') console.error(err);
                })
                .finally(() => setSearchLoading(false));
        }, 400);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [searchQuery]);

    // Ако търсачката не е на фокус, не рендираме нищо
    if (!isSearchFocused) return null;

    return (
        <div 
            className="fixed inset-0 z-[999999] flex justify-center items-start pt-28"
            // Спираме кликовете от тук нагоре към Navbar/App
            onClick={(e) => e.stopPropagation()} 
        >
            {/* 1. Backdrop (Фонът) - само той затваря при клик */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsSearchFocused(false);
                }}
            />

            {/* 2. Самият панел на търсачката */}
            <div
                ref={searchPanelRef}
                onMouseDown={(e) => e.stopPropagation()} // Важно: клик вътре в панела не затваря
                className="lg:w-full w-[90%] max-w-2xl bg-gray-900/95 backdrop-blur-3xl 
                           rounded-3xl shadow-2xl border border-gray-700/50 
                           overflow-hidden animate-in slide-in-from-top-4 duration-300"
            >
                {/* Header с Input */}
                <div className="flex items-center gap-4 px-8 py-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-gray-700/50">
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
                            onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery('');
                                setSearchResults([]);
                            }}
                            className="text-gray-500 hover:text-white transition"
                        >
                            {t.clear}
                        </button>
                    )}
                </div>

                {/* Резултати */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {searchLoading ? (
                        <div className="py-20 text-center">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
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
        </div>
    );
};

export default TrackSearch;
import {staticArtists} from "../config/topArtists.js";
import {CORSPROXY_URL, DEEZER_API_URL} from "../config/consts.js";

export const getTopTracks = async () => {
    try {
        const promises = staticArtists.slice(0, 10).map(artist =>
            fetch(`${CORSPROXY_URL}?${encodeURIComponent(`${DEEZER_API_URL}/artist/${artist.deezerId}/top?limit=5`)}`)
                .then(res => res.json())
        )
        const results = await Promise.all(promises);
        const allTracks = results.flatMap(data => data.data || []).filter(t => t.preview)

        return allTracks
            .sort(() => Math.random() - 0.5)
            .slice(0, 20)
    } catch (error) {
        console.error(error)
    }
    return []
}

export const getArtistTracks = async (deezerId) => {
    const url = `${DEEZER_API_URL}/artist/${deezerId}/top?limit=15`
    const response = await fetch(`${CORSPROXY_URL}?${encodeURIComponent(url)}`)
    const data = await response.json()

    return data.data?.filter(t => t.preview) || []
}

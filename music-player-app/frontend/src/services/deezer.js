import {staticArtists} from "../config/topArtists.js";
import {CORSPROXY_URL, DEEZER_API_URL} from "../config/consts.js";

export const getTopTracks = async () => {
    try {
        const selectedArtists = staticArtists.slice(0, 4)
        const promises = selectedArtists.map(async (artist) => {
            try {
                const url = `${DEEZER_API_URL}/artist/${artist.deezerId}/top?limit=10`
                const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`)

                if (!res.ok) {
                    console.log(`Artist error ${artist.name}: Status code: ${res.status}`)
                    return []
                }

                const data = await res.json()
                return data.data || []
            } catch {
                return []
            }
        })

        const results = await Promise.all(promises)
        const allTracks = results.flat().filter(t => t.preview)

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

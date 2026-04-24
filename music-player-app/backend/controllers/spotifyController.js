const {getSpotifyToken, getTracks, getArtistData} = require("../services/spotifyService")
const {getTrack} = require("../services/deezerService")

/**
 * Search tracks in Spotify and Deezer API
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.searchTracks = async (req, res) => {
    const { q } = req.query
    if (!q) return res.json({ tracks: { items: [] } })
    try {
        const result = await getTracks(q)

        const tracks = result.data
        for (let track of tracks.tracks.items) {
            if (!track.preview_url) {
                try {
                    const dRes = await getTrack(track)
                    if (dRes.data.data[0]?.preview) {
                        track.preview_url = dRes.data.data[0].preview
                    }
                } catch (e) {}
            }
        }

        res.json(result.data)
    } catch (err) {
        res.status(500).json({ error: "Search failed" })
    }
}

/**
 * Get artist details
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getArtist = async (req, res) => {
    try {
        const result = await getArtistData(req.params.id)
        res.json(result.data)
    } catch (err) {
        res.status(500).json({error: "Failed to fetch artist info"})
    }
}

/**
 * Get Spotify authentication token
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getToken = async (req, res) => {
    try {
        const spotifyToken = await getSpotifyToken()
        res.json({access_token: spotifyToken})
    } catch (err) {
        res.status(500).json({error: "Token sync failed"})
    }
}

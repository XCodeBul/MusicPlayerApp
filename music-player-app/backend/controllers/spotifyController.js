const {getSpotifyToken, getTracks, getArtistData} = require("../services/spotifyService")
const {getTrack} = require("../services/deezerService")

/**
 * Търсене на песни в Spotify и Deezer API
 */
exports.searchTracks = async (req, res) => {
    const { q } = req.query
    
    // Проверка за празна търсачка
    if (!q) return res.json({ tracks: { items: [] } })
    
    try {
        // Търсене на песните първо в Spotify
        const result = await getTracks(q)
        const tracks = result.data
        
        // Цикъл за проверка на всяка намерена песен
        for (let track of tracks.tracks.items) {
            // Ако Spotify няма 30-секундно аудио (preview), го търсим в Deezer
            if (!track.preview_url) {
                try {
                    const dRes = await getTrack(track)
                    if (dRes.data.data[0]?.preview) {
                        // Заменяме липсващото аудио с това от Deezer
                        track.preview_url = dRes.data.data[0].preview
                    }
                } catch (e) {} // Игнорираме грешка от Deezer, за да не спрем цялото търсене
            }
        }

        res.json(result.data)
    } catch (err) {
        res.status(500).json({ error: "Search failed" })
    }
}

/**
 * Вземане на детайли за изпълнител
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
 * Вземане на Spotify аутентикационен токен
 */
exports.getToken = async (req, res) => {
    try {
        const spotifyToken = await getSpotifyToken()
        res.json({access_token: spotifyToken})
    } catch (err) {
        res.status(500).json({error: "Token sync failed"})
    }
}
const axios = require("axios")
const {SPOTIFY_API_URL, SPOTIFY_AUTH_API} = require("../config/consts")
const {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} = require("../config/app")

/**
 * Вземане на Spotify токен за достъп (Authentication)
 */
exports.getSpotifyToken = async () => {
    // Кодиране на ID-то и Secret ключа в base64 формат за сигурност
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")
    try {
        // Изпращане на заявка за генериране на нов токен
        const res = await axios.post(SPOTIFY_AUTH_API, "grant_type=client_credentials", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${auth}`,
            },
        })
        return res.data.access_token
    } catch (err) {
        throw err
    }
}

/**
 * Търсене на списък с песни в Spotify
 */
exports.getTracks = async (q) => {
    const spotifyToken = await this.getSpotifyToken()
    // Заявка към търсачката на Spotify (връща максимум 10 песни)
    return await axios.get(`${SPOTIFY_API_URL}/search`, {
        params: {
            q,
            type: "track",
            limit: 10
        },
        headers: {
            Authorization: `Bearer ${spotifyToken}`
        }
    })
}

/**
 * Вземане на информация за изпълнител по ID от Spotify
 */
exports.getArtistData = async (id) => {
    const spotifyToken = await this.getSpotifyToken()
    return await axios.get(`${SPOTIFY_API_URL}/artists/${id}`, {
        headers: {Authorization: `Bearer ${spotifyToken}`}
    })
}
const axios = require("axios")
const {SPOTIFY_API_URL, SPOTIFY_AUTH_API} = require("../config/consts")
const {SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET} = require("../config/app")

exports.getSpotifyToken = async () => {
    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")
    try {
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

exports.getTracks = async (q) => {
    const spotifyToken = await this.getSpotifyToken()
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

exports.getArtistData = async (id) => {
    const spotifyToken = await this.getSpotifyToken()
    return await axios.get(`${SPOTIFY_API_URL}/artists/${id}`, {
        headers: {Authorization: `Bearer ${spotifyToken}`}
    })
}

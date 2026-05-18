const axios = require("axios")
const {DEEZER_SEARCH_API_URL} = require("../config/consts")

/**
 * Вземане на песен от Deezer API
 */
exports.getTrack = async (track) => {
    // Сглобяване на търсена фраза от името на песента и първия изпълнител
    const query = `${track.name} ${track.artists[0].name}`

    // Заявка към Deezer за намиране на първия най-точен резултат
    return await axios.get(`${DEEZER_SEARCH_API_URL}/track`, {
        params: {
            q: query,
            limit: 1
        }
    })
}
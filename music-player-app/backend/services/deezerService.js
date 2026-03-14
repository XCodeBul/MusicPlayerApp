const axios = require("axios")
const {DEEZER_SEARCH_API_URL} = require("../config/consts")

exports.getTrack = async (track) => {
    const query = `${track.name} ${track.artists[0].name}`

    return await axios.get(`${DEEZER_SEARCH_API_URL}/track`, {
        params: {
            q: query,
            limit: 1
        }
    })
}

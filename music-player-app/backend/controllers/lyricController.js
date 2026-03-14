const {getLyrics} = require("genius-lyrics-api")

/**
 * Get track lyrics
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.getLyrics = async (req, res) => {
    const { artist, title } = req.query
    if (!artist || !title) return res.json({ lyrics: "Select a song." })

    const options = {
        apiKey: process.env.GENIUS_API_KEY,
        title: title.split('-')[0].split('(')[0].trim(),
        artist: artist.split(',')[0].trim(),
        optimizeQuery: true
    }

    try {
        let lyrics = await getLyrics(options)

        if (lyrics) {
            const firstBracket = lyrics.indexOf('[')
            if (firstBracket !== -1) {
                lyrics = lyrics.substring(firstBracket)
            }

            lyrics = lyrics.replace(/\d*Embed$/g, "")
            lyrics = lyrics.replace(/You might also like/g, "")

            lyrics = lyrics.trim()

            res.json({ lyrics })
        } else {
            res.json({ lyrics: "Lyrics not found." })
        }
    } catch (error) {
        res.status(500).json({ lyrics: "Error fetching lyrics." })
    }
}

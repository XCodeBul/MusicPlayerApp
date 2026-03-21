const axios = require("axios");

async function generatePlaylistIdea(userPrompt) {
    const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
            model: "claude-sonnet-4-5",
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Generate music search queries based on this request: "${userPrompt}".
                                Return ONLY valid JSON, no extra text:
                                {
                                  "genres": [],
                                  "artists": [],
                                  "keywords": []
                                }`
                        }
                    ]
                }
            ]
        },
        {
            headers: {
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
        }
    )

    const text = response.data.content[0].text
    const cleaned = text.replace(/```json|```/g, "").trim()
    return JSON.parse(cleaned)
}

async function getSpotifyToken() {
    const res = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
            grant_type: "client_credentials"
        }),
        {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        process.env.SPOTIFY_CLIENT_ID +
                        ":" +
                        process.env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    )

    return res.data.access_token
}

async function searchTracks(token, queries) {
    const q = [
        ...queries.genres,
        ...queries.artists,
        ...queries.keywords
    ].join(" ")

    const res = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=20`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )

    return res.data.tracks.items.map(track => ({
        name: track.name,
        artist: track.artists[0].name,
        url: track.external_urls.spotify
    }))
}

exports.playlist = async (req, res) => {
    try {
        const { prompt } = req.body

        if (!prompt) {
            return res.status(400).json({ error: "Липсва 'prompt' в заявката" })
        }

        const idea = await generatePlaylistIdea(prompt)
        const token = await getSpotifyToken()
        const tracks = await searchTracks(token, idea)

        res.json({
            prompt,
            idea,
            tracks
        })
    } catch (err) {
        console.error(err.response?.data || err.message)
        res.status(500).json({ error: "Грешка при генериране на плейлист" })
    }
}

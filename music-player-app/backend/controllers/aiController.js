const Anthropic = require("@anthropic-ai/sdk")

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a music expert that creates personalized playlists.
When given a description, mood, activity, or theme, respond ONLY with a valid JSON array of exactly 10 songs.
Each object must have exactly two fields: "title" (song name) and "artist" (artist name).
Do not include any markdown, code blocks, explanation, or extra text — only the raw JSON array.
Example: [{"title":"Bohemian Rhapsody","artist":"Queen"},{"title":"Hotel California","artist":"Eagles"}]`

const generatePlaylist = async (req, res) => {
    const { prompt } = req.body

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        return res.status(400).json({ error: "Prompt is required." })
    }

    if (prompt.trim().length > 500) {
        return res.status(400).json({ error: "Prompt too long (max 500 characters)." })
    }

    try {
        const message = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 2048,
            system: SYSTEM_PROMPT,
            messages: [
                { role: "user", content: `Create a playlist for: ${prompt.trim()}` }
            ],
        })

        const raw = message.content[0].text.trim()
        const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim()
        const playlist = JSON.parse(cleaned)

        if (!Array.isArray(playlist)) {
            return res.status(500).json({ error: "Unexpected response format." })
        }

        const sanitized = playlist
            .filter(s => s && typeof s.title === "string" && typeof s.artist === "string")
            .slice(0, 10)
            .map(s => ({ title: s.title.trim(), artist: s.artist.trim() }))

        res.json({ playlist: sanitized })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to generate playlist. Please try again." })
    }
}

module.exports = { generatePlaylist }

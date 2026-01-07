require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

let token = null;
let tokenExpiry = 0;

const getSpotifyToken = async () => {
  if (token && Date.now() < tokenExpiry) return token;
  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");
  try {
    const res = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    });
    token = res.data.access_token;
    tokenExpiry = Date.now() + res.data.expires_in * 1000 - 60000;
    return token;
  } catch (err) {
    console.error("Грешка при токен:", err.message);
    throw err;
  }
};

// НОВ МАРШРУТ: Позволява на App.jsx да вземе токен
app.get("/api/token", async (req, res) => {
  try {
    const spotifyToken = await getSpotifyToken();
    res.json({ access_token: spotifyToken });
  } catch (err) {
    res.status(500).json({ error: "Failed to get token" });
  }
});

app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ tracks: { items: [] } });
  try {
    const spotifyToken = await getSpotifyToken();
    const result = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`, {
      headers: { Authorization: `Bearer ${spotifyToken}` }
    });
    const tracks = result.data.tracks.items;
    for (let track of tracks) {
      if (!track.preview_url) {
        try {
          const dRes = await axios.get(`https://api.deezer.com/search/track?q=${encodeURIComponent(track.name + " " + track.artists[0].name)}&limit=1`);
          if (dRes.data.data[0]?.preview) track.preview_url = dRes.data.data[0].preview;
        } catch (e) {}
      }
    }
    res.json(result.data);
  } catch (err) { res.status(500).json({ error: "Search failed" }); }
});

app.get("/api/artist/:id", async (req, res) => {
  try {
    const spotifyToken = await getSpotifyToken();
    const result = await axios.get(`https://api.spotify.com/v1/artists/${req.params.id}`, {
      headers: { Authorization: `Bearer ${spotifyToken}` }
    });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch artist" });
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
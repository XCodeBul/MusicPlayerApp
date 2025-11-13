// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Token cache
let token = null;
let tokenExpiry = 0;

// Get fresh Spotify token
const getToken = async () => {
  if (token && Date.now() < tokenExpiry) return token;

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
      }
    );

    token = res.data.access_token;
    tokenExpiry = Date.now() + res.data.expires_in * 1000 - 60000; // 1 min early
    return token;
  } catch (err) {
    console.error("Token error:", err.response?.data || err.message);
    throw err;
  }
};

// Search endpoint
app.get("/api/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ tracks: { items: [] } });

  try {
    const spotifyToken = await getToken();
    const result = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      }
    );
    res.json(result.data);
  } catch (err) {
    console.error("Search failed:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Test: http://localhost:${PORT}/api/search?q=hello`);
});

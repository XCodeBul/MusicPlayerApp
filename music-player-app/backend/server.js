require("dotenv").config()

const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const spotifyRoutes = require("./routes/spotifyRoutes")
const lyricRoutes = require("./routes/lyricRoutes")
const aiRoutes = require("./routes/aiRoutes")
const {APP_PORT} = require("./config/app")

const app = express()
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json())

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
})

app.use("/api", globalLimiter)

app.use("/api", spotifyRoutes)
app.use("/api/lyrics", lyricRoutes)
app.use("/api/ai", aiRoutes)

app.listen(APP_PORT, () => {
  console.log(`Music Player Backend running on http://localhost:${APP_PORT}`)
})

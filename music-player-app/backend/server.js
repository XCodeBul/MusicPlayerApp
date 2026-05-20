require("dotenv").config()

const express = require("express")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const spotifyRoutes = require("./routes/spotifyRoutes")
const lyricRoutes = require("./routes/lyricRoutes")
const {APP_PORT} = require("./config/app")

const app = express()

// Настройка на CORS политиките за сигурност (кой има достъп до бекенда)
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

// Разрешаване на приложението да чете JSON данни в заявките
app.use(express.json())

// Настройка на лимит за заявки (защита от спам - макс 200 заявки за 15 минути)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {error: "Too many requests, please try again later."},
})

// Групи routes
app.use("/api", globalLimiter, spotifyRoutes)
app.use("/api/lyrics", globalLimiter, lyricRoutes)

// Стартиране на сървъра на зададения порт
app.listen(APP_PORT, '0.0.0.0', () => {
    console.log(`Music Player Backend running on http://localhost:${APP_PORT}`)
})
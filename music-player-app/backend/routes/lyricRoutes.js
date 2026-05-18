const express = require("express")
const router = express.Router()
const lyrics = require("../controllers/lyricController")

// Дефиниране на GET маршрут за вземане на текст на песен
router.get("/", lyrics.getLyrics)

module.exports = router
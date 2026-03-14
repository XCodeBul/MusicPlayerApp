const express = require("express")
const router = express.Router()
const lyrics = require("../controllers/lyricController")

router.get("/", lyrics.getLyrics)

module.exports = router

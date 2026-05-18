const express = require("express")
const router = express.Router()
const spotifyController = require("../controllers/spotifyController")

// Маршрут за търсене на песни в Spotify и Deezer
router.get("/search", spotifyController.searchTracks)

// Маршрут за вземане на информация за конкретен изпълнител по ID
router.get("/artist/:id", spotifyController.getArtist)

// Маршрут за вземане на валиден Spotify токен
router.get("/token", spotifyController.getToken)

module.exports = router
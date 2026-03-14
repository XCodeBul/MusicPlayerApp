const express = require("express")
const router = express.Router()
const spotifyController = require("../controllers/spotifyController")

router.get("/search", spotifyController.searchTracks)
router.get("/artist/:id", spotifyController.getArtist)
router.get("/token", spotifyController.getToken)

module.exports = router

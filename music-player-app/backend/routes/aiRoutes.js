const express = require("express")
const router = express.Router()
const { generatePlaylist } = require("../controllers/aiController")

router.post("/playlist", generatePlaylist)

module.exports = router

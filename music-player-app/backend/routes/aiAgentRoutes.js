const express = require("express")
const router = express.Router()
const aiAgentController = require("../controllers/aiAgentController")

router.post("/playlist", aiAgentController.playlist)

module.exports = router

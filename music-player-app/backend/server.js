require("dotenv").config()

const express = require("express")
const cors = require("cors")
const spotifyRoutes = require("./routes/spotifyRoutes")
const lyricRoutes = require("./routes/lyricRoutes")
const {APP_PORT} = require("./config/app")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api", spotifyRoutes)
app.use("/api/lyrics", lyricRoutes)

app.listen(APP_PORT, () => {
  console.log(`Music Player Backend running on http://localhost:${APP_PORT}`)
})

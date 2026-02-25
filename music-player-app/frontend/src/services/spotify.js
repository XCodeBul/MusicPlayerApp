export const getSpotifyToken = async () => {
    try {
        return fetch("http://localhost:5000/api/token")
            .then(data => data.json())

    } catch (err) {
        console.error("Token sync error:", err)
    }
}

const express = require('express');
const YoutubeMusicApi = require('youtube-music-api');

async function startApp() {
    const app = express();
    const api = new YoutubeMusicApi();
    const port = process.env.PORT || 8080;

    try {
        await api.initalize({ cookies: process.env.YT_COOKIE });
        console.log('API successfully initialized.');
    } catch (error) {
        console.error('FATAL: Could not initialize API. Check your cookie.', error);
        throw error;
    }

    app.use(express.static('public'));

    // API route to get search results
    app.get('/api/library/playlists', async (req, res) => {
        try {
            const searchResults = await api.search("trending songs", "song");
            res.json(searchResults.content);
        } catch (error) {
            console.error("Error in search route:", error);
            res.status(500).json({ error: error.message });
        }
    });

    // API route to get the song's playable URL - THIS IS THE CORRECTED VERSION
    app.get('/api/stream/:videoId', async (req, res) => {
        try {
            const videoId = req.params.videoId;
            const songData = await api.getSong(videoId); // The correct function is getSong
            res.json({ url: songData.streamingData.formats[0].url }); // The correct path to the URL
        } catch (error) {
            console.error("Error getting stream URL:", error);
            res.status(500).json({ error: error.message });
        }
    });

    app.listen(port, () => {
        console.log(`ODDEY server listening on port ${port}`);
    });
}

startApp();

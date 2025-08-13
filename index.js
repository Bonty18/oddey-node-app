const express = require('express');
const YoutubeMusicApi = require('youtube-music-api');
const path = require('path');

const app = express();
const api = new YoutubeMusicApi();
const port = process.env.PORT || 8080;

// Serve the frontend files from the 'public' folder
app.use(express.static('public'));

// Initialize the YouTube Music API with our cookie
api.initalize({ cookies: process.env.YT_COOKIE })
    .then(info => {
        console.log('YouTube Music API Initialized.');
    }).catch(err => {
        console.error('Failed to initialize API:', err);
    });

// --- API ROUTES ---
app.get('/api/library/playlists', async (req, res) => {
    try {
        const searchResults = await api.search("trending songs", "song");
        res.json(searchResults.content);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// NEW ROUTE TO GET THE SONG'S PLAYABLE URL
app.get('/api/stream/:videoId', async (req, res) => {
    try {
        const videoId = req.params.videoId;
        const songData = await api.getStreamingData(videoId); // Correct function name
        res.json({ url: songData.formats[0].url });     // Correct path to the URL
    } catch (error) {
        console.error("Error getting stream URL:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`ODDEY server listening on port ${port}`);
});

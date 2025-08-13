const express = require('express');
const YoutubeMusicApi = require('youtube-music-api');
const path = require('path');

const app = express();
const api = new YoutubeMusicApi();
const port = process.env.PORT || 8080;

// Serve the frontend files (HTML, CSS, JS)
app.use(express.static('public'));

// Initialize the YouTube Music API with our cookie
// It reads the cookie from the Environment Variable we will set on Render
api.initalize({ cookies: process.env.YT_COOKIE })
    .then(info => {
        console.log('YouTube Music API Initialized.');
    }).catch(err => {
        console.error('Failed to initialize API:', err);
    });

// --- API ROUTES ---
app.get('/api/library/playlists', async (req, res) => {
    try {
        const playlists = await api.getLibraryPlaylists();
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`ODDEY server listening on port ${port}`);
});

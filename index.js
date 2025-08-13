const express = require('express');
const YoutubeMusicApi = require('youtube-music-api');

// This function will run our entire application
async function startApp() {
    const app = express();
    const api = new YoutubeMusicApi();
    const port = process.env.PORT || 8080;

    // We will now WAIT for the API to initialize before doing anything else
    try {
        await api.initalize({ cookies: process.env.YT_COOKIE });
        console.log('API successfully initialized.');
    } catch (error) {
        console.error('FATAL: Could not initialize API. Check your cookie.', error);
        // If we can't log in, there is no point in starting the server.
        // We will let the app crash so the logs show the real error.
        throw error;
    }

    // --- Now that we are logged in, we can set up the app ---

    // Serve the frontend files (HTML, CSS, JS) from the 'public' folder
    app.use(express.static('public'));

    // API route to get search results (we are still using search for testing)
    app.get('/api/library/playlists', async (req, res) => {
        try {
            const searchResults = await api.search("trending songs", "song");
            res.json(searchResults.content);
        } catch (error) {
            console.error("Error in search route:", error);
            res.status(500).json({ error: error.message });
        }
    });

    // API route to get the song's playable URL
    app.get('/api/stream/:videoId', async (req, res) => {
        try {
            const videoId = req.params.videoId;
            // The method is just `search` again, but for a video ID
            const songData = await api.search(videoId, "song");
            // The structure is slightly different for a direct search
            res.json({ url: songData.content[0].url });
        } catch (error) {
            console.error("Error getting stream URL:", error);
            res.status(500).json({ error: error.message });
        }
    });

    // Start the server ONLY after the API is ready
    app.listen(port, () => {
        console.log(`ODDEY server listening on port ${port}`);
    });
}

// Start our application by calling the main function
startApp();

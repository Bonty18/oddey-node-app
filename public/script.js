window.addEventListener('load', () => {
    fetchPlaylists();
});

async function fetchPlaylists() {
    const content = document.getElementById('content');
    try {
        const response = await fetch('/api/library/playlists');

        // This new part checks if the server responded with an error
        if (!response.ok) {
            throw new Error(`Server responded with an error: ${response.status}`);
        }

        const playlists = await response.json();

        // This checks if the response is empty or invalid
        if (!playlists || playlists.length === 0) {
             content.innerHTML = '<h2>No playlists found in your library.</h2>';
             return;
        }

        content.innerHTML = '<h2>My Playlists</h2>';

        playlists.forEach(playlist => {
            const playlistDiv = document.createElement('div');
            playlistDiv.className = 'playlist-item';
            playlistDiv.innerText = playlist.title;
            content.appendChild(playlistDiv);
        });

    } catch (error) {
        // This new part will show us the specific error message
        content.innerHTML = `<h2>Failed to load library.</h2><p style="color:red;">Details: ${error.message}</p>`;
    }
}

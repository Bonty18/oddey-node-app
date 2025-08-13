window.addEventListener('load', () => {
    fetchPlaylists();
});

async function fetchPlaylists() {
    const content = document.getElementById('content');
    try {
        const response = await fetch('/api/library/playlists');
        const playlists = await response.json();

        content.innerHTML = '<h2>My Playlists</h2>';

        playlists.forEach(playlist => {
            const playlistDiv = document.createElement('div');
            playlistDiv.className = 'playlist-item';
            playlistDiv.innerText = playlist.title;
            content.appendChild(playlistDiv);
        });

    } catch (error) {
        content.innerHTML = '<h2>Failed to load library.</h2>';
    }
}

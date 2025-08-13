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

        const songs = await response.json(); // We changed the variable name to songs
        
        // This checks if the response is empty or invalid
        if (!songs || songs.length === 0) {
             content.innerHTML = '<h2>No songs found.</h2>'; // Changed the message
             return;
        }
        
        content.innerHTML = '<h2>Trending Songs</h2>'; // Changed the title
        
        // This loop now displays song names
        songs.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.className = 'playlist-item';
            songDiv.innerText = song.name; // We now use song.name
            content.appendChild(songDiv);
        });

    } catch (error) {
        // This new part will show us the specific error message
        content.innerHTML = `<h2>Failed to load library.</h2><p style="color:red;">Details: ${error.message}</p>`;
    }
}

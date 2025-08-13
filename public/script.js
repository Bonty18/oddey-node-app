window.addEventListener('load', () => {
    fetchPlaylists();
});

async function fetchPlaylists() {
    const content = document.getElementById('content');
    try {
        const response = await fetch('/api/library/playlists');

        if (!response.ok) {
            throw new Error(`Server responded with an error: ${response.status}`);
        }

        const songs = await response.json();

        if (!songs || songs.length === 0) {
             content.innerHTML = '<h2>No songs found.</h2>';
             return;
        }

        content.innerHTML = '<h2>Trending Songs</h2>';

        songs.forEach(song => {
            const songDiv = document.createElement('div');
            songDiv.className = 'playlist-item';
            songDiv.innerText = song.name;

            // --- NEW --- Store the videoId on the element
            songDiv.dataset.videoId = song.videoId;

            // --- NEW --- Add a click event listener
            songDiv.addEventListener('click', playSong);

            content.appendChild(songDiv);
        });

    } catch (error) {
        content.innerHTML = `<h2>Failed to load library.</h2><p style="color:red;">Details: ${error.message}</p>`;
    }
}

// --- NEW --- This function runs when a song is clicked
async function playSong(event) {
    const videoId = event.target.dataset.videoId;
    const audioPlayer = document.getElementById('audio-player');

    try {
        // Ask our backend for the streaming URL
        const response = await fetch(`/api/stream/${videoId}`);
        const data = await response.json();

        if(data.url) {
            // Set the URL on the audio player and play it
            audioPlayer.src = data.url;
            audioPlayer.play();
        } else {
            alert('Could not get streaming URL.');
        }
    } catch (error) {
        alert('Error fetching song.');
    }
}

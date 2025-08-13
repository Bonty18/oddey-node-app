window.addEventListener('load', () => {
    fetchSongs();
});

async function fetchSongs() {
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

            // Store the videoId so we know which song to play
            songDiv.dataset.videoId = song.videoId;

            // Add the click event listener to play the song
            songDiv.addEventListener('click', playSong);

            content.appendChild(songDiv);
        });

    } catch (error) {
        content.innerHTML = `<h2>Failed to load library.</h2><p style="color:red;">Details: ${error.message}</p>`;
    }
}

// This new function runs when a song is clicked
async function playSong(event) {
    const videoId = event.target.dataset.videoId;
    const audioPlayer = document.getElementById('audio-player');
    
    // Let the user know we're loading the song
    event.target.innerText = "Loading...";

    try {
        // Ask our backend for the streaming URL
        const response = await fetch(`/api/stream/${videoId}`);
        const data = await response.json();

        if(data.url) {
            // Set the URL on the audio player and play it
            audioPlayer.src = data.url;
            audioPlayer.play();
            // We can change the text back after we start loading
            event.target.innerText = event.target.dataset.originalTitle || event.target.innerText;
        } else {
            alert('Could not get streaming URL.');
            event.target.innerText = event.target.dataset.originalTitle || event.target.innerText;
        }
    } catch (error) {
        alert('Error fetching song.');
        event.target.innerText = event.target.dataset.originalTitle || event.target.innerText;
    }
}

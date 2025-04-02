document.addEventListener('DOMContentLoaded', () => {
    // const spotifyEmbed = document.getElementById('spotify-embed'); // REMOVED
    const fakeSpotifyUI = document.getElementById('fake-spotify-ui');
    const revealMessage = document.getElementById('reveal-message');
    const notificationArea = document.getElementById('notification-area');
    const playlistTrackList = document.getElementById('playlist-track-list');
    const nowPlaying = document.getElementById('now-playing');
    const playButton = document.querySelector('.play-button'); // Get play button
    const playerBarControls = document.querySelector('.spotify-player-bar .player-controls'); // Get player bar controls element
    const youtubePlayerElement = document.getElementById('youtube-player'); // Get YouTube player div

    // --- Configuration ---
    const initialLoadDelay = 1000; // Delay before prank starts (simulates loading)
    const prankDelay = 2500; // milliseconds (2.5 seconds)
    const notificationDuration = 3000; // milliseconds (3 seconds)
    const prankDuration = 18000; // milliseconds (18 seconds)
    const girlfriendName = "Karrigan"; // !! IMPORTANT: Replace with her actual name or nickname !!
    const prankVideoId = 'SbC9pryp7eM'; // YouTube video ID for the prank
    const imagesToDownload = ['images/thom1.png', 'images/thom2.png']; // Images for download prank

    // --- Radiohead Data (URLs for potential future audio integration) ---
    // Note: Direct linking to Spotify audio isn't possible without their SDK/API.
    // YouTube links might work but could break or show ads.
    // For this prank, we are *simulating* playback visually.
    const radioheadSongs = [
        { title: "Creep", album: "Pablo Honey", duration: "3:58", /* audioSrc: 'YOUTUBE_OR_OTHER_URL' */ },
        { title: "No Surprises", album: "OK Computer", duration: "3:49" },
        { title: "Karma Police", album: "OK Computer", duration: "4:21" },
        { title: "Everything In Its Right Place", album: "Kid A", duration: "4:11" },
        { title: "Let Down", album: "OK Computer", duration: "4:59" },
        { title: "Paranoid Android", album: "OK Computer", duration: "6:23" },
        { title: "Fake Plastic Trees", album: "The Bends", duration: "4:50" },
        { title: "Idioteque", album: "Kid A", duration: "5:09" },
    ];

    // --- Prank Steps Data ---
    const prankSteps = [
        { delay: 500, message: "Adding Radiohead - Creep to your Favorites ❤️", action: 'addSong', songIndex: 0 },
        { delay: 1500, message: "Creating Playlist: 'Ultimate Radiohead Mix'", action: 'playSong', songIndex: 0 },
        { delay: 2500, message: "Adding 'Karma Police' to all your playlists…", action: 'addSong', songIndex: 2 },
        { delay: 1800, message: "Setting 'Creep' by Radiohead as your alarm sound…", action: 'none' },
        { delay: 2200, message: "Playing 'No Surprises'... Resistance is futile.", action: 'playSong', songIndex: 1 },
        { delay: 2000, message: "Analyzing listening history... Seems you need more Radiohead.", action: 'addSong', songIndex: 3 },
        { delay: 1500, message: "Adding 'Let Down' because... well, it's Radiohead.", action: 'addSong', songIndex: 4 },
        { delay: 2000, message: "Is this real life? Or just a Fanta sea? Playing 'Idioteque'", action: 'playSong', songIndex: 7 },
    ];

    let firstSongAdded = false; // Flag to clear placeholder
    let ytPlayer; // Variable to hold the YouTube player instance
    let ytApiReady = false; // Flag for YouTube API readiness

    // --- Initial Setup ---
    // Remove any references to embedCreator or elements inside the old embed
    // const embedCreator = fakeSpotifyUI.querySelector('.embed-playlist-creator'); // REMOVE or ensure it's not used if class was unique to embed
    // if (embedCreator) { ... } // REMOVE

    // Personalize Reveal Message
    const revealHeader = revealMessage.querySelector('h1');
    if (revealHeader) {
        revealHeader.textContent = `April Fools, ${girlfriendName}! ❤️`;
    }

    // --- Start Prank on Load ---
    // Ensure this is called correctly
    setTimeout(startPrank, initialLoadDelay);

    // --- Functions ---
    function startPrank() {
        // Ensure no logic here tries to hide an embed or show the main UI
        playVideo(); // Start playing the YouTube video
        triggerDownloads(); // Attempt to download images
        setTimeout(runPrankSequence, prankDelay);
        setTimeout(revealJoke, prankDelay + prankDuration);
    }

    // Function called by the YouTube API when it's ready
    window.onYouTubeIframeAPIReady = function() {
        console.log("YouTube API Ready");
        ytApiReady = true;
        // If startPrank tried to play the video before API was ready, try again
        if (youtubePlayerElement && !ytPlayer) {
             createPlayer();
        }
    };

    function createPlayer() {
        if (!ytApiReady || !youtubePlayerElement) {
             console.log("YouTube API not ready or player element not found, player creation deferred.");
             return; // Don't create player if API isn't ready or element doesn't exist
        }
        console.log("Creating YouTube Player");
        try {
            ytPlayer = new YT.Player('youtube-player', {
                height: '1', // Minimal size, hidden by CSS anyway
                width: '1',
                videoId: prankVideoId,
                playerVars: {
                    'playsinline': 1 // Important for mobile
                },
                events: {
                    'onReady': onPlayerReady,
                    'onError': onPlayerError
                }
            });
        } catch (e) {
            console.error("Error creating YouTube player:", e);
        }
    }

    // The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        console.log("YouTube Player Ready");
        // Attempt to play immediately and set volume
        event.target.setVolume(100); // Max volume
        event.target.playVideo();
         // Double-check play command due to browser autoplay restrictions
        setTimeout(() => {
             if (event.target.getPlayerState() !== YT.PlayerState.PLAYING) {
                 console.log("Retrying playVideo due to potential autoplay block.");
                 event.target.playVideo();
             }
         }, 500); // Short delay before retry
    }

    function onPlayerError(event) {
        console.error("YouTube Player Error:", event.data);
    }

    function playVideo() {
        if (!ytPlayer) {
            console.log("Player not initialized yet, creating...");
            createPlayer(); // Try to create the player
        } else if (ytPlayer.playVideo) {
             console.log("Playing video via existing player instance.");
             ytPlayer.setVolume(100);
             ytPlayer.playVideo();
             // Double-check play command
             setTimeout(() => {
                 if (ytPlayer.getPlayerState() !== YT.PlayerState.PLAYING) {
                     console.log("Retrying playVideo on existing player.");
                     ytPlayer.playVideo();
                 }
             }, 500);
        } else {
             console.warn("ytPlayer object exists but playVideo method not available?");
        }
    }

    function triggerDownloads() {
        console.log("Attempting to trigger downloads...");
        imagesToDownload.forEach(imageUrl => {
            try {
                const link = document.createElement('a');
                link.href = imageUrl;
                // Extract filename for the download attribute
                link.download = imageUrl.split('/').pop() || 'downloaded-image';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                console.log(`Triggered download for: ${imageUrl}`);
            } catch (e) {
                console.error(`Error triggering download for ${imageUrl}:`, e);
            }
        });
    }

    function runPrankSequence() {
        let cumulativeDelay = 0;
        prankSteps.forEach((step) => {
            cumulativeDelay += step.delay;
            setTimeout(() => {
                // Check if reveal is already shown
                if (revealMessage.classList.contains('hidden')) {
                    showNotification(step.message);
                    if (step.action === 'addSong' && step.songIndex !== undefined) {
                        addSongToPlaylist(radioheadSongs[step.songIndex]);
                    }
                    if (step.action === 'playSong' && step.songIndex !== undefined) {
                        playSong(radioheadSongs[step.songIndex]);
                    }
                }
            }, cumulativeDelay);
        });
        // If audio was playing, stop it here: audioElement.pause(); audioElement.currentTime = 0;
        // Stop YouTube video
        if (ytPlayer && ytPlayer.stopVideo) {
            console.log("Stopping YouTube video.");
            ytPlayer.stopVideo();
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'spotify-notification';
        notification.textContent = message;
        notificationArea.appendChild(notification);
        setTimeout(() => notification.style.opacity = 1, 10);
        setTimeout(() => {
            notification.style.opacity = 0;
            setTimeout(() => notification.remove(), 500);
        }, notificationDuration);
    }

    function addSongToPlaylist(song) {
        // Clear placeholder on first add
        if (!firstSongAdded) {
            const placeholder = playlistTrackList.querySelector('.track-row[style*="opacity"]');
            if (placeholder) placeholder.remove();
            firstSongAdded = true;
        }

        const existingTracks = playlistTrackList.querySelectorAll('.track-row');
        const trackNumber = existingTracks.length + 1;
        const trackRow = document.createElement('div');
        trackRow.className = 'track-row new-track';
        trackRow.innerHTML = `
            <span style="text-align: right;">${trackNumber}</span>
            <span>${song.title}</span>
            <span>${song.album}</span>
            <span>Just now</span>
            <span>${song.duration}</span>
        `;
        playlistTrackList.appendChild(trackRow);
        playlistTrackList.scrollTop = playlistTrackList.scrollHeight;
        setTimeout(() => trackRow.classList.add('flash'), 10);
        setTimeout(() => trackRow.classList.remove('flash'), 600);
    }

    function playSong(song) {
        nowPlaying.textContent = `${song.title} - Radiohead`;

        // Update Playlist Play button
        if (playButton) {
             playButton.textContent = '❚❚'; // Pause symbol
             playButton.title = 'Pause';
        }
        // Update Player Bar Play button symbol (visual simulation)
        if (playerBarControls) {
            playerBarControls.innerHTML = '[ << ] [ ❚❚ ] [ >> ]';
        }

        // --- Audio Simulation ---
        // If you were to add real audio:
        // 1. Create an <audio> element or use a library like Howler.js
        // 2. Get the audio source URL (song.audioSrc)
        // 3. Load and play the audio: audioElement.src = song.audioSrc; audioElement.play();
        // 4. Handle errors, loading states, etc.
        // 5. Potentially disable controls during the 'locked' period
        console.log(`Simulating playback of: ${song.title}`);
    }

    function revealJoke() {
        notificationArea.innerHTML = ''; // Clear notifications
        revealMessage.classList.remove('hidden');

        // Reset player state visually
        if (playButton) {
             playButton.textContent = '►'; // Play symbol
             playButton.title = 'Play';
        }
        if (playerBarControls) {
             playerBarControls.innerHTML = '[ << ] [ ► ] [ >> ]';
        }
        nowPlaying.textContent = 'Nothing';

        // If audio was playing, stop it here: audioElement.pause(); audioElement.currentTime = 0;
    }

}); 
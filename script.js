document.addEventListener('DOMContentLoaded', () => {
    // const spotifyEmbed = document.getElementById('spotify-embed'); // REMOVED
    const fakeSpotifyUI = document.getElementById('fake-spotify-ui');
    const revealMessage = document.getElementById('reveal-message');
    const notificationArea = document.getElementById('notification-area');
    const playlistTrackList = document.getElementById('playlist-track-list');
    const nowPlaying = document.getElementById('now-playing');
    const playButton = document.querySelector('.play-button'); // Get play button
    const playerBarControls = document.querySelector('.spotify-player-bar .player-controls'); // Get player bar controls element
    const playerBarControlsButtons = document.querySelector('.spotify-player-bar .player-controls-buttons'); // Player bar buttons container
    const playerBarPlayButton = document.querySelector('.play-button.player'); // Player bar play button
    const nowPlayingTitle = document.getElementById('now-playing-title'); // Player bar track title
    const nowPlayingArtist = document.getElementById('now-playing-artist'); // Player bar track artist
    const playerAlbumArt = document.querySelector('.player-album-art'); // Player bar album art
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
    const radioheadSongs = [
        { 
            title: "Creep", 
            album: "Pablo Honey", 
            duration: "3:58",
            artwork: "https://upload.wikimedia.org/wikipedia/en/8/8f/Radiohead.pablohoney.albumart.jpg"
        },
        { 
            title: "No Surprises", 
            album: "OK Computer", 
            duration: "3:49",
            artwork: "https://upload.wikimedia.org/wikipedia/en/a/a1/Radiohead.okcomputer.albumart.jpg"
        },
        { 
            title: "Karma Police", 
            album: "OK Computer", 
            duration: "4:21",
            artwork: "https://upload.wikimedia.org/wikipedia/en/a/a1/Radiohead.okcomputer.albumart.jpg"
        },
        { 
            title: "Everything In Its Right Place", 
            album: "Kid A", 
            duration: "4:11",
            artwork: "https://upload.wikimedia.org/wikipedia/en/0/0e/Radiohead.kida.albumart.jpg"
        },
        { 
            title: "Let Down", 
            album: "OK Computer", 
            duration: "4:59",
            artwork: "https://upload.wikimedia.org/wikipedia/en/a/a1/Radiohead.okcomputer.albumart.jpg"
        },
        { 
            title: "Paranoid Android", 
            album: "OK Computer", 
            duration: "6:23",
            artwork: "https://upload.wikimedia.org/wikipedia/en/a/a1/Radiohead.okcomputer.albumart.jpg"
        },
        { 
            title: "Fake Plastic Trees", 
            album: "The Bends", 
            duration: "4:50",
            artwork: "https://upload.wikimedia.org/wikipedia/en/5/57/Radiohead.bends.albumart.jpg"
        },
        { 
            title: "Idioteque", 
            album: "Kid A", 
            duration: "5:09",
            artwork: "https://upload.wikimedia.org/wikipedia/en/0/0e/Radiohead.kida.albumart.jpg"
        },
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
    let audioPrankStarted = false; // Flag to ensure audio plays only once on click

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

    // --- Add Event Listener for Play Button --- 
    if (playButton) {
        playButton.addEventListener('click', handlePlayButtonClick);
    }

    // --- Functions ---
    function startPrank() {
        console.log("Starting prank sequence");
        // Always try to create the player immediately
        if (!ytPlayer) {
            console.log("No player exists, attempting to create one");
            createPlayer();
        }
        triggerDownloads();
        setTimeout(runPrankSequence, prankDelay);
        setTimeout(revealJoke, prankDelay + prankDuration);
        
        // Auto-trigger play button after a short delay
        setTimeout(() => {
            console.log("Auto-triggering play button");
            handlePlayButtonClick();
        }, 2000); // Wait 2 seconds before auto-playing
    }

    // Function called by the YouTube API when it's ready
    window.onYouTubeIframeAPIReady = function() {
        console.log("YouTube API Ready - Creating player immediately");
        ytApiReady = true;
        createPlayer();
    };

    function createPlayer() {
        if (!ytApiReady) {
            console.log("YouTube API not ready yet, will create player when ready");
            return;
        }
        if (!youtubePlayerElement) {
            console.error("YouTube player element not found!");
            return;
        }
        if (ytPlayer) {
            console.log("Player already exists");
            return;
        }

        console.log("Creating YouTube Player");
        try {
            ytPlayer = new YT.Player('youtube-player', {
                height: '1',
                width: '1',
                videoId: prankVideoId,
                playerVars: {
                    'playsinline': 1,
                    'controls': 0,
                    'disablekb': 1,
                    'enablejsapi': 1,
                    'fs': 0,
                    'modestbranding': 1,
                    'iv_load_policy': 3
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange,
                    'onError': onPlayerError
                }
            });
        } catch (e) {
            console.error("Error creating YouTube player:", e);
        }
    }

    function onPlayerReady(event) {
        console.log("YouTube Player Ready");
        // Set volume to maximum
        event.target.setVolume(100);
        console.log("Volume set to:", event.target.getVolume());
    }

    function onPlayerStateChange(event) {
        console.log("Player state changed to:", event.data);
        // If the video ends, replay it
        if (event.data === YT.PlayerState.ENDED && audioPrankStarted) {
            event.target.playVideo();
        }
    }

    function onPlayerError(event) {
        console.error("YouTube Player Error:", event.data);
        // Try to recover from errors
        if (ytPlayer && audioPrankStarted) {
            setTimeout(() => {
                console.log("Attempting to recover from error...");
                playVideo();
            }, 1000);
        }
    }

    function playVideo() {
        console.log("Attempting to play video");
        if (!ytPlayer) {
            console.error("No YouTube player available!");
            return;
        }

        try {
            // Ensure volume is at maximum
            ytPlayer.setVolume(100);
            console.log("Volume set to:", ytPlayer.getVolume());
            
            // Start playback
            ytPlayer.playVideo();
            
            // Double-check playback started
            setTimeout(() => {
                if (ytPlayer.getPlayerState() !== YT.PlayerState.PLAYING) {
                    console.log("Playback didn't start, retrying...");
                    ytPlayer.playVideo();
                }
            }, 500);
        } catch (e) {
            console.error("Error playing video:", e);
        }
    }

    function handlePlayButtonClick() {
        console.log("Play button clicked");
        if (!audioPrankStarted) {
            console.log("Starting audio prank");
            
            // Ensure player exists and is ready
            if (!ytPlayer) {
                console.log("Creating player before playing");
                createPlayer();
                // Wait for player to be ready
                setTimeout(playVideo, 1000);
            } else {
                playVideo();
            }
            
            audioPrankStarted = true;
            
            // Update UI
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                playButton.title = 'Pause';
            }
            updatePlayerBarState('playing');
            nowPlayingTitle.textContent = "Loading...";
            nowPlayingArtist.textContent = "";
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
            <div class="track-title-artist">
                <img src="${song.artwork}" alt="${song.album}" class="track-album-art">
                <div class="track-info">
                    <span>${song.title}</span>
                    <span class="track-artist">Radiohead</span>
                </div>
            </div>
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
        // Update Player Bar
        nowPlayingTitle.textContent = song.title;
        nowPlayingArtist.textContent = "Radiohead";
        
        // Update Player Bar Album Art
        const playerAlbumArt = document.querySelector('.player-album-art');
        if (playerAlbumArt) {
            playerAlbumArt.src = song.artwork;
        }

        // Update Player Bar Controls state (if audio prank has started)
        if (audioPrankStarted) {
            updatePlayerBarState('playing');
            if (playButton) {
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
                playButton.title = 'Pause';
            }
        }

        console.log(`Simulating playback of: ${song.title}`);
    }

    function revealJoke() {
        notificationArea.innerHTML = ''; // Clear notifications
        revealMessage.classList.remove('hidden');

        // Reset player state visually
        updatePlayerBarState('paused'); // Reset player bar
        if (playButton) {
             playButton.innerHTML = '<i class="fas fa-play"></i>'; // Play icon
             playButton.title = 'Play';
             audioPrankStarted = false; // Reset audio prank flag
        }
        nowPlayingTitle.textContent = 'Nothing playing';
        nowPlayingArtist.textContent = '';
        // playerAlbumArt.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // Reset art

        // Stop YouTube video
        if (ytPlayer && ytPlayer.stopVideo) {
            console.log("Stopping YouTube video.");
            ytPlayer.stopVideo();
        }
    }

    // Helper to update player bar visual state
    function updatePlayerBarState(state) {
        if (playerBarPlayButton) {
             playerBarPlayButton.innerHTML = state === 'playing' ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
             playerBarPlayButton.title = state === 'playing' ? 'Pause' : 'Play';
        }
        // Could update other buttons (like shuffle, repeat) or progress bar here if needed
    }

}); 
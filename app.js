document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Effect for Header ---
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Playlist Data ---
  const playlist = [
    {
      title: 'Perfect Harmony',
      artist: 'Controlled by MusicDeck',
      duration: '3:45',
      durationSec: 225
    },
    {
      title: 'Midnight Groove',
      artist: 'Ambient Lounge',
      duration: '2:58',
      durationSec: 178
    },
    {
      title: 'Neon Skyline',
      artist: 'Synthwave Project',
      duration: '4:12',
      durationSec: 252
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let currentTimeSec = 0;
  let progressInterval = null;

  // --- Elements ---
  const macbook = document.querySelector('.device.macbook');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');

  const iconPlay = btnPlayPause.querySelector('.icon-play');
  const iconPause = btnPlayPause.querySelector('.icon-pause');

  // Track Display Elements
  const songTitles = document.querySelectorAll('.song-title, .iphone-song-title');
  const songArtists = document.querySelectorAll('.song-artist, .iphone-song-artist');
  const desktopProgress = document.getElementById('desktopProgress');
  const desktopCurrentTime = document.getElementById('desktopCurrentTime');
  const desktopTotalTime = document.querySelector('.playback-progress .total-time');

  // --- Update Track Details UI ---
  function updateTrackUI() {
    const track = playlist[currentTrackIndex];
    
    // Update titles and artists
    songTitles.forEach(el => el.textContent = track.title);
    songArtists.forEach(el => el.textContent = track.artist);
    
    // Update times
    desktopTotalTime.textContent = track.duration;
    
    // Reset progress
    resetProgress();
  }

  function resetProgress() {
    currentTimeSec = 0;
    desktopProgress.style.width = '0%';
    desktopCurrentTime.textContent = '0:00';
  }

  // Format seconds to M:SS
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // --- Playback Control Functions ---
  function play() {
    isPlaying = true;
    macbook.classList.add('playing');
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');

    const track = playlist[currentTrackIndex];

    progressInterval = setInterval(() => {
      currentTimeSec++;
      if (currentTimeSec >= track.durationSec) {
        // Track finished, go to next
        nextTrack();
      } else {
        // Update progress bar & current time text
        const percent = (currentTimeSec / track.durationSec) * 100;
        desktopProgress.style.width = `${percent}%`;
        desktopCurrentTime.textContent = formatTime(currentTimeSec);
      }
    }, 1000);
  }

  function pause() {
    isPlaying = false;
    macbook.classList.remove('playing');
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
    
    clearInterval(progressInterval);
  }

  function togglePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function nextTrack() {
    const wasPlaying = isPlaying;
    pause();
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    updateTrackUI();
    if (wasPlaying) {
      play();
    }
  }

  function prevTrack() {
    const wasPlaying = isPlaying;
    pause();
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    updateTrackUI();
    if (wasPlaying) {
      play();
    }
  }

  // --- Event Listeners for Controls ---
  btnPlayPause.addEventListener('click', togglePlayPause);
  btnNext.addEventListener('click', nextTrack);
  btnPrev.addEventListener('click', prevTrack);

  // Initialize UI
  updateTrackUI();


  // --- Scroll Reveal Animation ---
  // We will dynamic add entry animations for cards and sections
  const revealElements = document.querySelectorAll('.feature, .steps li, .download-card, .support-card');
  
  // Inject scroll animation helper CSS inline to prevent separate CSS updates if possible
  const style = document.createElement('style');
  style.textContent = `
    .reveal-item {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .reveal-item.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Add reveal class to targets
  revealElements.forEach(el => el.classList.add('reveal-item'));

  const observerOptions = {
    root: null, // viewport
    threshold: 0.1, // 10% of element visible
    rootMargin: '0px 0px -50px 0px' // offset
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
});

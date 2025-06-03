const fileInput = document.getElementById('file-input');
const playlistEl = document.getElementById('playlist');
const audioPlayer = document.getElementById('audio-player');
const nowPlaying = document.getElementById('now-playing');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const clearBtn = document.getElementById('clear-playlist');

let playlist = [];
let currentIndex = -1;
let isPlaying = false;
let isShuffle = false;

fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const url = URL.createObjectURL(file);
    playlist.push({ name: file.name, url });
  });
  if (currentIndex === -1 && playlist.length > 0) {
    currentIndex = 0;
    loadTrack(currentIndex);
  }
  renderPlaylist();
});

clearBtn.addEventListener('click', () => {
  playlist = [];
  currentIndex = -1;
  audioPlayer.pause();
  audioPlayer.src = "";
  nowPlaying.textContent = "Aucune musique chargée";
  renderPlaylist();
});

function loadTrack(index) {
  const track = playlist[index];
  if (!track) return;
  audioPlayer.src = track.url;
  nowPlaying.textContent = `En lecture : ${track.name}`;
}

function playTrack() {
  if (currentIndex === -1) return;
  audioPlayer.play();
  isPlaying = true;
  playPauseBtn.textContent = "⏸️";
}

function pauseTrack() {
  audioPlayer.pause();
  isPlaying = false;
  playPauseBtn.textContent = "▶️";
}

playPauseBtn.addEventListener('click', () => {
  if (isPlaying) pauseTrack();
  else playTrack();
});

prevBtn.addEventListener('click', () => {
  if (playlist.length === 0) return;
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentIndex);
  playTrack();
});

nextBtn.addEventListener('click', () => {
  if (playlist.length === 0) return;
  currentIndex = (currentIndex + 1) % playlist.length;
  loadTrack(currentIndex);
  playTrack();
});

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "#ff3333" : "#b30000";
});

audioPlayer.addEventListener('ended', () => {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentIndex = (currentIndex + 1) % playlist.length;
  }
  loadTrack(currentIndex);
  playTrack();
});

function renderPlaylist() {
  playlistEl.innerHTML = "";
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = track.name;
    li.addEventListener('click', () => {
      currentIndex = index;
      loadTrack(index);
      playTrack();
    });
    if (index === currentIndex) {
      li.style.color = "#ff3333";
    }
    playlistEl.appendChild(li);
  });
}

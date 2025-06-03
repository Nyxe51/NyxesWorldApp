const fileInput = document.getElementById("file-upload");
const audioPlayer = document.getElementById("audio-player");
const nowPlaying = document.getElementById("now-playing");
const playlistEl = document.getElementById("playlist");
const playPauseBtn = document.getElementById("play-pause");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const clearBtn = document.getElementById("clear-playlist");

let playlist = [];
let currentIndex = 0;
let isShuffling = false;

// 📥 Ajout des fichiers
fileInput.addEventListener("change", () => {
  const files = Array.from(fileInput.files).filter(file => file.name.endsWith(".mp3"));

  files.forEach(file => {
    const url = URL.createObjectURL(file);
    playlist.push({ name: file.name, url });
  });

  renderPlaylist();
  if (playlist.length === files.length) playTrack(0); // Première fois = jouer
});

// 🎧 Lire une musique
function playTrack(index) {
  currentIndex = index;
  const track = playlist[currentIndex];
  audioPlayer.src = track.url;
  audioPlayer.play();
  nowPlaying.textContent = "🎶 " + track.name;
  highlightCurrent();
}

// ▶️⏸ Play / Pause
playPauseBtn.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
});

// ⏭ Next
nextBtn.addEventListener("click", () => {
  currentIndex = isShuffling
    ? Math.floor(Math.random() * playlist.length)
    : (currentIndex + 1) % playlist.length;
  playTrack(currentIndex);
});

// ⏮ Prev
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  playTrack(currentIndex);
});

// 🔀 Shuffle
shuffleBtn.addEventListener("click", () => {
  isShuffling = !isShuffling;
  shuffleBtn.style.opacity = isShuffling ? "1" : "0.5";
});

// 🧼 Clear playlist
clearBtn.addEventListener("click", () => {
  playlist = [];
  playlistEl.innerHTML = "";
  nowPlaying.textContent = "Aucune musique chargée";
  audioPlayer.pause();
  audioPlayer.removeAttribute("src");
});

// 📜 Générer la liste
function renderPlaylist() {
  playlistEl.innerHTML = "";
  playlist.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = track.name;
    li.addEventListener("click", () => playTrack(index));
    playlistEl.appendChild(li);
  });
  highlightCurrent();
}

// 🌟 Marquer la musique en cours
function highlightCurrent() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((li, i) => {
    li.style.fontWeight = i === currentIndex ? "bold" : "normal";
    li.style.color = i === currentIndex ? "#b3004b" : "#000";
  });
}

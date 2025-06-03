// Playlist par défaut avec tes musiques
let playlist = [
  { name: "QUE PASA", url: "musics/que_pasa.mp3" },
  { name: "NUEKI, TOLCHONOV - LIKE THIS!", url: "musics/nueki_tolchonov_like_this.mp3" },
  { name: "LOS VOLTAJE", url: "musics/los_voltaje.mp3" },
  { name: "WHY ULTRAFUNK", url: "musics/why_ultrafunk.mp3" }
];

let currentIndex = 0;
let isShuffling = false;

const audioPlayer = document.getElementById("audio-player");
const playlistEl = document.getElementById("playlist");
const nowPlayingEl = document.getElementById("now-playing");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");

function renderPlaylist() {
  playlistEl.innerHTML = "";
  playlist.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = track.name;
    li.classList.toggle("playing", index === currentIndex);
    li.addEventListener("click", () => {
      playTrack(index);
    });
    playlistEl.appendChild(li);
  });
}

function playTrack(index) {
  if (index < 0) index = playlist.length - 1;
  if (index >= playlist.length) index = 0;
  currentIndex = index;
  audioPlayer.src = playlist[currentIndex].url;
  audioPlayer.play();
  nowPlayingEl.textContent = "En train de jouer : " + playlist[currentIndex].name;
  renderPlaylist();
  updatePlayPauseBtn();
}

function togglePlayPause() {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
  updatePlayPauseBtn();
}

function updatePlayPauseBtn() {
  playPauseBtn.textContent = audioPlayer.paused ? "▶️" : "⏸️";
}

function playNext() {
  if (isShuffling) {
    playTrack(Math.floor(Math.random() * playlist.length));
  } else {
    playTrack(currentIndex + 1);
  }
}

function playPrev() {
  if (isShuffling) {
    playTrack(Math.floor(Math.random() * playlist.length));
  } else {
    playTrack(currentIndex - 1);
  }
}

function toggleShuffle() {
  isShuffling = !isShuffling;
  shuffleBtn.style.color = isShuffling ? "red" : "black";
}

playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);
shuffleBtn.addEventListener("click", toggleShuffle);

audioPlayer.addEventListener("ended", playNext);

renderPlaylist();
playTrack(currentIndex);

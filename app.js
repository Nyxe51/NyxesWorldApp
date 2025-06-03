const audio = document.getElementById('audio-player');
const nowPlaying = document.getElementById('now-playing');
const playlistElement = document.getElementById('playlist');
const fileInput = document.getElementById('file-input');
const clearPlaylistBtn = document.getElementById('clear-playlist');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const playlistNameInput = document.getElementById('playlist-name');
const savePlaylistBtn = document.getElementById('save-playlist');
const loadPlaylistSelect = document.getElementById('load-playlist-select');
const deletePlaylistBtn = document.getElementById('delete-playlist');

let playlist = [];
let currentTrackIndex = 0;

// Charge la playlist de base ou depuis localStorage
function loadPlaylistsFromStorage() {
  const saved = localStorage.getItem('nyxe_playlists');
  if (saved) {
    return JSON.parse(saved);
  }
  return {};
}

function savePlaylistsToStorage(playlists) {
  localStorage.setItem('nyxe_playlists', JSON.stringify(playlists));
}

// Gère la liste des playlists sauvegardées dans le select
function refreshPlaylistSelect() {
  const playlists = loadPlaylistsFromStorage();
  loadPlaylistSelect.innerHTML = `<option value="">-- Charger une playlist --</option>`;
  Object.keys(playlists).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    loadPlaylistSelect.appendChild(opt);
  });
}

function loadPlaylist(name) {
  const playlists = loadPlaylistsFromStorage();
  if (playlists[name]) {
    playlist = playlists[name];
    currentTrackIndex = 0;
    renderPlaylist();
    loadTrack(currentTrackIndex);
    playlistNameInput.value = name;
  }
}

function saveCurrentPlaylist() {
  const name = playlistNameInput.value.trim();
  if (!name) {
    alert('Donne un nom à ta playlist pour la sauvegarder !');
    return;
  }
  const playlists = loadPlaylistsFromStorage();
  playlists[name] = playlist;
  savePlaylistsToStorage(playlists);
  refreshPlaylistSelect();
  alert(`Playlist "${name}" sauvegardée !`);
}

function deleteCurrentPlaylist() {
  const name = playlistNameInput.value.trim();
  if (!name) {
    alert('Sélectionne ou écris le nom d\'une playlist à supprimer !');
    return;
  }
  const playlists = loadPlaylistsFromStorage();
  if (playlists[name]) {
    delete playlists[name];
    savePlaylistsToStorage(playlists);
    refreshPlaylistSelect();
    alert(`Playlist "${name}" supprimée !`);
    playlistNameInput.value = '';
  } else {
    alert('Playlist introuvable.');
  }
}

// Crée les éléments playlist dans le DOM
function renderPlaylist() {
  playlistElement.innerHTML = '';
  playlist.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = track.name;
    li.classList.add('playlist-item');
    if(index === currentTrackIndex) {
      li.classList.add('playing');
    }
    li.addEventListener('click', () => {
      currentTrackIndex = index;
      loadTrack(currentTrackIndex);
      playAudio();
      renderPlaylist();
    });
    playlistElement.appendChild(li);
  });
}

function loadTrack(index) {
  if(playlist.length === 0) {
    nowPlaying.textContent = "Aucune musique chargée";
    audio.src = "";
    return;
  }
  const track = playlist[index];
  nowPlaying.textContent = `🎵 ${track.name}`;
  audio.src = track.url;
  audio.load();
}

function playAudio() {
  audio.play();
  playPauseBtn.textContent = 'Pause';
}

function pauseAudio() {
  audio.pause();
  playPauseBtn.textContent = 'Play';
}

function togglePlayPause() {
  if(audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
}

function playNext() {
  if(playlist.length === 0) return;
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  playAudio();
  renderPlaylist();
}

function playPrev() {
  if(playlist.length === 0) return;
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  playAudio();
  renderPlaylist();
}

function shufflePlaylist() {
  if(playlist.length === 0) return;
  for (let i = playlist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
  }
  currentTrackIndex = 0;
  loadTrack(currentTrackIndex);
  playAudio();
  renderPlaylist();
}

// Gestion upload fichiers locaux
fileInput.addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    if(file.type !== "audio/mpeg") {
      alert(`Fichier "${file.name}" non supporté, uniquement MP3.`);
      return;
    }
    const url = URL.createObjectURL(file);
    playlist.push({name: file.name, url});
  });
  renderPlaylist();
  if(playlist.length === files.length) { // Si playlist vide avant
    currentTrackIndex = 0;
    loadTrack(currentTrackIndex);
  }
  fileInput.value = ''; // Reset input
});

// Clear playlist
clearPlaylistBtn.addEventListener('click', () => {
  playlist = [];
  currentTrackIndex = 0;
  loadTrack(currentTrackIndex);
  renderPlaylist();
  playlistNameInput.value = '';
});

// Boutons contrôle
playPauseBtn.addEventListener('click', togglePlayPause);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
shuffleBtn.addEventListener('click', shufflePlaylist);

// Sauvegarder la playlist
savePlaylistBtn.addEventListener('click', saveCurrentPlaylist);

// Charger une playlist
loadPlaylistSelect.addEventListener('change', () => {
  const name = loadPlaylistSelect.value;
  if(name) loadPlaylist(name);
});

// Supprimer playlist
deletePlaylistBtn.addEventListener('click', deleteCurrentPlaylist);

// Quand une musique finit, joue la suivante automatiquement
audio.addEventListener('ended', playNext);

// Initialisation
refreshPlaylistSelect();
renderPlaylist();
loadTrack(currentTrackIndex);

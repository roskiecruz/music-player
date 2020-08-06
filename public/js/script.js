const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');

// Play
function playOrPauseSong() {
    if(music.paused){
        music.play();
        playBtn.classList.replace('fa-play','fa-pause');
        playBtn.setAttribute('title',"Pause");
    } else {
        music.pause();
        playBtn.classList.replace('fa-pause','fa-play');
        playBtn.setAttribute('title',"Play");    
    }
}
// Play or pause event listener
playBtn.addEventListener('click', playOrPauseSong);

// Update DOM
function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    music.src = `public/music/${song.name}.mp3`;
    image.src = `public/img/${song.name}.jpg`
}

let songIndex = 0;
let totalSongs = songs.length;

// Next song
function nextSong() {
    songIndex++;
    if(songIndex > songs.length - 1){
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playOrPauseSong();
}

// Previous song
function prevSong() {
    songIndex--;
    if(songIndex < 0){
        songIndex = songs.length-1;
    }
    loadSong(songs[songIndex]);
    playOrPauseSong();
}

// On load - select first song
loadSong(songs[songIndex]);

// Event listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
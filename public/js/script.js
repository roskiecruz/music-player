const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container'); 
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
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

function getDurationElement(duration){
    // Calculate display for duration
    let minutes = Math.floor(duration / 60);
    let seconds = Math.floor(duration % 60);
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    //console.log('minutes :', minutes);
    //console.log('seconds :', seconds);
    return { minutes, seconds };
}

// Update progress bar & time
function updateProgressBar(e){
    if (!music.paused){
        const { duration, currentTime} = e.srcElement;
        //console.log(duration, currentTime);
        // Update progress bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        let totalDuration = getDurationElement(duration);
        // Delay switching duration element to avoid NaN
        if (totalDuration.seconds) {
            durationEl.textContent = `${totalDuration.minutes}:${totalDuration.seconds}`;
        }
        let currentDuration = getDurationElement(currentTime);
        // Delay switching duration element to avoid NaN
        if (currentDuration.seconds){
            currentTimeEl.textContent = `${currentDuration.minutes}:${currentDuration.seconds}`
        }
    }
}

// Event listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
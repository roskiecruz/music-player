const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container'); 
const progress = document.getElementById('progress');
const volumeContainer = document.getElementById('volume-bar');
const volumeIcon = document.getElementById('volume-icon');
const volume = document.getElementById('volume');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');

let currentVolume = music.volume;

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
updateProgressBar();
updateVolumeBar();

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

function clearClassList(elem){
    elem.setAttribute("class", "");
    return elem.classList;
}

function updateVolumeBar(e){
    const volumePercent = music.volume * 100;
    volume.style.width = `${volumePercent}%`;
    if (!volumePercent){
        volumeIcon.classList = clearClassList(volumeIcon);
        volumeIcon.classList.add('fas','fa-volume-mute');
    } else if (volumePercent <= 25) {
        volumeIcon.classList = clearClassList(volumeIcon);
        volumeIcon.classList.add('fas','fa-volume-off');
    } else if (volumePercent <= 50) {
        volumeIcon.classList = clearClassList(volumeIcon);
        volumeIcon.classList.add('fas','fa-volume-down');
    } else if (volumePercent <= 75) {
        volumeIcon.classList = clearClassList(volumeIcon);
        volumeIcon.classList.add('fas','fa-volume-up');
    } 
}

// Set progress bar
function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = music;
    const seekTime = Math.floor((clickX / width) * duration);
    music.currentTime = seekTime;
}

// Set volume
function setVolume(e){
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const seekVolume = (clickX / width);
    music.volume = seekVolume;
}

function muteUnmute(){
    if(music.volume > 0){
        currentVolume = music.volume;
        music.volume = 0;
        updateVolumeBar();
    } else {
        music.volume = currentVolume;
        updateVolumeBar();
    }
}

// Event listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('ended', nextSong);
music.addEventListener('volumechange', updateVolumeBar);
progressContainer.addEventListener('click', setProgressBar);
volumeContainer.addEventListener('click', setVolume);
volumeIcon.addEventListener('click', muteUnmute);
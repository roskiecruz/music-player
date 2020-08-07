const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container'); 
const progress = document.getElementById('progress');
const volumeContainer = document.getElementById('volume-bar');
const volumeIcon = document.getElementById('volume-icon');
const volume = document.getElementById('volume');
const themeIcon = document.getElementById('theme-icon');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');

let currentVolume = music.volume;
let currentTheme = localStorage.getItem('theme');
const sun = 'fa-sun';
const moon = 'fa-moon';

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

// Helper function to clear class list
function clearClassList(elem){
    elem.setAttribute("class", "");
    return elem.classList;
}

// Update volume icon based on volume
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

// Mute unmute volume when volume icon is clicked
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

function switchMode(mode){
    document.documentElement.setAttribute('data-theme', mode);
    (mode === 'dark') ? themeIcon.classList.replace(sun, moon) : themeIcon.classList.replace(moon, sun);
    (mode === 'dark') ? themeIcon.setAttribute('title','Dark Mode') : themeIcon.setAttribute('title','Light Mode');
}

// Change theme when icon is clicked
function switchTheme(){
    currentTheme = localStorage.getItem('theme');
    if(currentTheme === 'light'){
        localStorage.setItem('theme','dark');
        switchMode(localStorage.getItem('theme'));
    } else {
        localStorage.setItem('theme','light');
        switchMode(localStorage.getItem('theme'));
    }
}

// On load - select first song
loadSong(songs[songIndex]);
updateProgressBar();
updateVolumeBar();
switchMode(currentTheme);

// Event listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('ended', nextSong);
music.addEventListener('volumechange', updateVolumeBar);
progressContainer.addEventListener('click', setProgressBar);
volumeContainer.addEventListener('click', setVolume);
volumeIcon.addEventListener('click', muteUnmute);
themeIcon.addEventListener('click', switchTheme);
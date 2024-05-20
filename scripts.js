const menuBtn = document.querySelector(".menu-btn"),
 container = document.querySelector(".container");


const progressBar = document.querySelector(".bar"),
 progressDot = document.querySelector(".dot"),
 currentTimeEl = document.querySelector(".current-time"),
 DurationEl = document.querySelector(".duration");


menuBtn.addEventListener("click", () => {
 container.classList.toggle("active");
});


const songs = [
 {
   title: "Song 1",
   artist: "Artist 1",
   img_src: "media/celine.webp",
   src: "media/anewbeginning.mp3"
 },
 {
   title: "Song 2",
   artist: "Artist 2",
   img_src: "media/Skylar.webp",
   src: "media/cute.mp3"
 }
];


let audio = new Audio();
let playing = false;
let currentSong = 0;
let shuffle = false;
let repeat = false;
let favourites = [];


// Initialize audio player
const init = () => {
 updatePlaylist(songs);
 loadSong();
};


// Function to play a song
const playSong = (songIndex) => {
 if (songIndex >= 0 && songIndex < songs.length) {
   const song = songs[songIndex];
   audio.src = song.src;
   audio.play();
   console.log(`Now playing: ${song.title} by ${song.artist}`);
 } else {
   console.error("Invalid song index.");
 }
};


// Example usage
playSong(0); // Play the first song


// Update the playlist
const updatePlaylist = (songs) => {
 playlistContainer.innerHTML = "";


 songs.forEach((song, index) => {
   const { title, src } = song;
   const isFavourite = favourites.includes(index);


   const tr = document.createElement("tr");
   tr.classList.add("song");
   tr.innerHTML = `
   <td class="no">
   <h5>${index + 1}</h5>
</td>
<td class="title">
   <h6>${title}</h6>
</td>


<td class="length">
   <h5>2:03</h5>
</td>
<td>
  <i class="fas fa-heart ${isFavourite ? "active" : ""}"></i>
</td>`;


   tr.addEventListener("click", (e) => {
     currentSong = index;
     loadSong(currentSong);
     audio.play();
     container.classList.remove("active");
     playPauseBtn.classList.replace("fa-play", "fa-pause");
     playing = true;
   });


   const audioForDuration = new Audio(`data/${src}`);
   audioForDuration.addEventListener("loadedmetadata", () => {
     if (e.target.classList.contains("fa-heart")) {
       addToFavourites(index);


       e.target.classList.toggle("active");


       return;
     }


     let songDuration = formatTime(audioForDuration.duration);
     tr.querySelector(".length h5").innerText = songDuration;
   });


   playlistContainer.appendChild(tr);
 });
};


// Format time
const formatTime = (time) => {
 let minutes = Math.floor(time / 60);
 let seconds = Math.floor(time % 60);


 seconds = seconds < 10 ? `0${seconds}` : seconds;
 return `${minutes}: ${seconds}`;
};


// Load current song
const loadSong = (num) => {
 const song = songs[num];
 audio.src = `data/${song.src}`;
 infoWrapper.innerHTML = `
   <h2>${song.title}</h2>
   <h3>${song.artist}</h3>
 `;
 coverImage.style.backgroundImage = `url(media/cover${song.img_src})`;
 currentSongTitle.innerHTML = song.title;


 // If current song is in favourites, highlight it
 if (favourites.includes(num)) {
   currentFavourite.classList.add("active");
 } else {
   currentFavourite.classList.remove("active");
 }
};


// Play/Pause functionality
const playPauseBtn = document.querySelector("#playpause");


playPauseBtn.addEventListener("click", () => {
 if (playing) {
   audio.pause();
   playPauseBtn.classList.replace("fa-pause", "fa-play");
   playing = false;
 } else {
   audio.play();
   playPauseBtn.classList.replace("fa-play", "fa-pause");
   playing = true;
 }
});


// Add to favourites
const addToFavourites = (index) => {
 if (favourites.includes(index)) {
   favourites = favourites.filter((item) => item !== index);
   currentFavourite.classList.remove("active");
 } else {
   favourites.push(index);


   if (index === currentSong) {
     currentFavourite.classList.add("active");
   }
 }


 updatePlaylist(songs);
};


// Add to favourites when clicked on heart
currentFavourite.addEventListener("click", () => {
 addToFavourites(currentSong);
});


// Shuffle functionality
const shuffleBtn = document.querySelector("#shuffle");


const shuffleSongs = () => {
 shuffle = !shuffle;
 shuffleBtn.classList.toggle("active");
};


shuffleBtn.addEventListener("click", shuffleSongs);


// If shuffle is true, shuffle songs when playing next or prev
const shuffleFunc = () => {
 if (shuffle) {
   let newIndex;
   do {
     newIndex = Math.floor(Math.random() * songs.length);
   } while (newIndex === currentSong);
   currentSong = newIndex;
 }
};


// Next song functionality
const nextBtn = document.querySelector("#next");


nextBtn.addEventListener("click", () => {
 shuffleFunc();
 currentSong++;
 if (currentSong >= songs.length) {
   currentSong = 0;
 }
 loadSong(currentSong);
 audio.play();
 container.classList.remove("active");
 playPauseBtn.classList.replace("fa-play", "fa-pause");
 playing = true;
});


// Repeat functionality
const repeatBtn = document.querySelector("#repeat");


const repeatSong = () => {
 if (repeat === 0) {
   repeat = 1;
   repeatBtn.classList.add("active");
 } else if (repeat === 1) {
   repeat = 2;
   repeatBtn.classList.add("active");
 } else {
   repeat = 0;
   repeatBtn.classList.remove("active");
 }
};


repeatBtn.addEventListener("click", repeatSong);


// On audio end
audio.addEventListener("ended", () => {
 if (repeat === 1) {
   audio.play();
 } else if (repeat === 2) {
   nextBtn.click();
   audio.play();
 } else {
   nextBtn.click();
 }
});


// Progress bar
const progress = () => {
 const { duration, currentTime } = audio;


 currentTimeEl.innerHTML = formatTime(currentTime);
 DurationEl.innerHTML = formatTime(duration);


 const progressPercentage = (currentTime / duration) * 100;
 progressDot.style.left = `${progressPercentage}%`;
};


audio.addEventListener("timeupdate", progress);


// Change progress when clicked on bar
const setProgress = (e) => {
 const width = this.clientWidth;
 const clickX = e.offsetX;
 const duration = audio.duration;
 audio.currentTime = (clickX / width) * duration;
};


progressBar.addEventListener("click", setProgress);


init();









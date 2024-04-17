console.log("Cholo shuru kora hok")
let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(){
let a = await fetch("http://127.0.0.1:5500/songs/")
let response = await a.text()
console.log(response)
let  div = document.createElement("div")
div.innerHTML = response;
let music = div.getElementsByTagName("a")
// console.log(music)
let songs = []
for (let index = 0; index < music.length; index++) {
    const element = music[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split("/songs/")[1])
    }
    
}
return songs

}

// functions to play the music
const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/"+track);
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play();
    play.src = "/images/pause.svg"
    }
    

    // showing song durationa and song name in the seekbar
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
    
}


// function to get all song list and play it when user interact with it
async function main(){    
    songs = await getsongs()
    playMusic(songs[0],true)
    // console.log(songs)    

    // it will show all the songs in the library section
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="34" src="images/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                <div>Dipak</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div> </li>`;
    }

     // Attaching an event listener to each song
     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
     })
     
     //Attaching and event listener to each song buttons(play,next and previous)

     play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "/images/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "/images/play.svg"

        }
     })

     // updating the time of the song using timeupdate event

     currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songtime").innerHTML= `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
     })

     // adding and event listener to seekbar
     document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
     })

     // Add an event listener to hamburger
     document.querySelector(".hamburger").addEventListener("click",() =>{
        document.querySelector(".left").style.left=0;
     })

     document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left= "-120%";
     })

     // Add an event listener to previous
       prev.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
       next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })
}
// getsongs()s    
    
main()
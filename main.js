console.log("Cholo shuru kora hok")


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


// function to get all song list and play it when user interact with it
async function main(){    
    let songs = await getsongs()
    console.log(songs)    

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

    //play the first song
    var audio = new Audio(songs[0])     
    // audio.play();   

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration)
        // The duration variable now holds the duration (in seconds) of the audio clip
      });
}
// getsongs()s    
    
main()
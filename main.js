// console.log("Cholo shuru kora hok");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currFolder = folder;

  let a = await fetch(`http://127.0.0.1:5502/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let music = div.getElementsByTagName("a");
  // console.log(music)
  songs = [];
  for (let index = 0; index < music.length; index++) {
    const element = music[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  // it will show all the songs in the library section
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" width="20" src="images/music.svg" alt="">
                          <div class="info">
                              <div> ${song.replaceAll("%20", " ")}</div>
                              
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              <img class="invert" src="images/play.svg" alt="">
                          </div> </li>`;
  }

  // Attaching an event listener to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      //   console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
    //   console.log(e.querySelector(".info").firstElementChild.innerHTML);
  });
  return songs
}

// functions to play the music
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track);
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/images/pause.svg";
  }

  // showing song durationa and song name in the seekbar
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);

  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-2)[1];
      //get the metadata of the folder
      let a = await fetch(`http://127.0.0.1:5502/songs/${folder}/info.json`);

      //  <svg width="16" height="16" viewBox="0 0 24 24" fill="#000" xmlns="https://www.w3.org/2000/svg">
    //   <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
    //   <!-- <img src="/images/play.svg" alt=""> -->
    // </svg>

      let response = await a.json();
      // console.log(response);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div class="card" data-folder="${folder}">
            <div class="play">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#000" xmlns="https://www.w3.org/2000/svg">
                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                <!-- <img src="/images/play.svg" alt=""> -->
              </svg>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="" />
            <h2>${response.title}</h2>
            <p>${response.description}</p>
          </div>`;
    }
  }
  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      // console.log("Fetching Songs");
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    });
  });
}

// function to get all song list and play it when user interact with it
async function main(folder) {
  await getsongs("/songs/ncs");
  playMusic(songs[0], true);

  // Display all the albums dynamically
  displayAlbums();

  //Attaching and event listener to each song buttons(play,next and previous)

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/images/play.svg";
    }
  });

  // updating the time of the song using timeupdate event

  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // adding and event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // Add an event listener to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Add an event listener to previous
  prev.addEventListener("click", () => {
    currentSong.pause();
    // console.log("Previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  // Add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    // console.log("Next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });


    // adding event listener to mute track

    // document.querySelector(".voulume>img").addEventListener("click", v=>{
    //     if(v.target.rc.includes("volume.svg")){
    //         v.target.src = v.target.src.replace("/images/mute.svg", "/images/volume.svg")
    //         currentSong.volume = .10;
    //     }
    //     else{
    //         v.target.src.target.src.replace("/images/mute.svg","volume.svg")
    //     }
    // })

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
  // // load the playlist songs when clicked
  // Array.from(document.getElementsByClassName("card")).forEach((e) => {
  //     // console.log(e)
  //     e.addEventListener("click", async (item) => {
  //         // console.log(item,item.currentTarget.dataset)
  //         songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
  //     });
  // });
}
// getsongs()s

main();
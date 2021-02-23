//alert("hey");
// end point
const url = "https://s2021-8556.restdb.io/rest/great-songs?max=20";

const mediaurl = "https://s2021-8556.restdb.io/media/";

const options = {
  headers: {
    "x-apikey": "6034ed655ad3610fb5bb655d",
  },
};

function getData() {
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      //We have the data
      console.log(data);
      show(data);
    })
    .catch((e) => {
      //Woops, something went wrong
      console.error("An error occured:", e.message);
    });
  document.querySelectorAll("input").forEach((box) => {
    box.addEventListener(click, hey);
  });
}

/* function box() {
  alert("hey");
} */
/* async function getData() {
  const response = await fetch(url, options);
  const data = await response.json();
  show(data);
  //console.log(data);
} */

function show(data) {
  console.table(data);
  data.forEach((song) => {
    const template = document.querySelector("template").content;
    const clone = template.cloneNode(true);

    clone.querySelector("h2").textContent = song.title;

    const h4_span = clone.querySelector("h4 span");
    h4_span.textContent = song.artist;

    // clone.querySelector("p").textContent = person.email;
    // clone.querySelector("img").src = mediaurl + person.image[0];

    const ytLink = "https://www.youtube.com/embed/" + song.youtube_embed;
    clone.querySelector("iframe").src = ytLink;

    const genres = song.genres;
    //https://www.w3schools.com/jsref/jsref_split.asp
    const ulEl = clone.querySelector("ul");
    const arrayOfGenres = genres; //genres.split(", ");
    console.log(arrayOfGenres);
    arrayOfGenres.forEach((genre) => {
      const liEl = document.createElement("li");
      liEl.textContent = genre;
      ulEl.appendChild(liEl);
    });

    // clone.querySelector(".preloader").remove();
    const mainEl = document.querySelector("main");
    mainEl.appendChild(clone);
  });
  document.querySelector(".preloader").remove();
}

//getData();
window.addEventListener("DOMContentLoaded", getData);

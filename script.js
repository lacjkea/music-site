//getNav() when DOM is ready;
window.addEventListener("DOMContentLoaded", getNav);

//NOTES - repo
//https://github.com/lacjkea/music-site
//https://lacjkea.github.io/music-site/

//NOTES - endpoints
//https://s2021-8556.restdb.io/rest/great-songs?apikey=6034ed655ad3610fb5bb655d
//https://s2021-8556.restdb.io/rest/great-songs?q={%22artist%22:%22BABYMETAL%22}&apikey=6034ed655ad3610fb5bb655d

const urlParams = new URLSearchParams(window.location.search);
const genre = urlParams.get("genre");
const mainEl = document.querySelector("main");

let endpointurl = "https://s2021-8556.restdb.io/rest/great-songs?max=20";

// ?q={"genres":{"$in":["Metal"]}}
if (genre) {
  endpointurl += `&q={"genres": {"$in": ["${genre}"]}}`;
}

console.log(endpointurl); //use this for debugging

const options = {
  headers: {
    "x-apikey": "6034ed655ad3610fb5bb655d",
  },
};

//https://s2021-8556.restdb.io/rest/great-songs/_meta?apikey=6034ed655ad3610fb5bb655d

function getNav() {
  fetch("https://s2021-8556.restdb.io/rest/great-songs/_meta", options)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      //We have the data
      //console.log(data);
      buildNav(data);
    })
    .catch((e) => {
      //Woops, something went wrong
      console.error("An error occured:", e.message);
    });
  getData(endpointurl);
}

function buildNav(data) {
  console.log("buildNav");
  console.log(
    "genresArray / the option list:",
    data.fields[10].properties.option_list
  );
  const genres = data.fields[10].properties.option_list.split(", ");
  genres.forEach((genreName) => {
    const template = document.querySelector(".nav-item").content;
    const clone = template.cloneNode(true);
    const liAEl = clone.querySelector("li a");
    liAEl.textContent = genreName;
    // aEl.setAttribute("href", += genreName);
    liAEl.href += genreName;

    const navUlEl = document.querySelector("nav ul");
    navUlEl.appendChild(liAEl);
  });
}

function getData(url) {
  fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      //We have the data
      //console.log(data);
      // mainEl.innerHTML = "";
      show(data);
    })
    .catch((e) => {
      //Woops, something went wrong
      document.querySelector("main").innerHTML = "<p>Something went wrong.</p>";
      document.querySelector(".preloader").classList.add("hide");
      console.error("An error occured:", e.message);
    });
}

function show(data) {
  document.querySelector("h1").textContent = genre;
  console.table(data);
  data.forEach((song) => {
    const template = document.querySelector(".song").content;
    const clone = template.cloneNode(true);

    clone.querySelector("h2").textContent = song.title;

    const h4_span = clone.querySelector("h4 span");
    h4_span.textContent = song.artist;

    const ytLink = "https://www.youtube.com/embed/" + song.youtube_embed;
    clone.querySelector("iframe").src = ytLink;

    const img = clone.querySelector("img");
    // img.src = song.img + "error";
    img.src = song.img;
    img.alt = song.artist;
    clone.querySelector("figcaption").innerHTML =
      "Image attribution: " + song.img_attribution;

    const arrayOfGenres = song.genres;
    //https://www.w3schools.com/jsref/jsref_split.asp
    const ulEl = clone.querySelector("ul");
    // const arrayOfGenres = genres; //genres.split(", ");
    console.log("arrayOfGenres for " + song.title + ": ", arrayOfGenres);
    arrayOfGenres.forEach((genre) => {
      const liEl = document.createElement("li");
      liEl.textContent = genre;
      ulEl.appendChild(liEl);
    });

    // clone.querySelector(".preloader").remove();
    mainEl.appendChild(clone);
  });
  document.querySelector(".preloader").classList.add("hide");
}

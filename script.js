//https://s2021-8556.restdb.io/rest/great-songs?apikey=6034ed655ad3610fb5bb655d
//https://s2021-8556.restdb.io/rest/great-songs?q={%22artist%22:%22BABYMETAL%22}&apikey=6034ed655ad3610fb5bb655d

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product = urlParams.get("product");

const mainEl = document.querySelector("main");

//alert("hey");
// end point
const endpointurl = "https://s2021-8556.restdb.io/rest/great-songs?max=20";

const mediaurl = "https://s2021-8556.restdb.io/media/";

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
      buildFilters(data);
    })
    .catch((e) => {
      //Woops, something went wrong
      console.error("An error occured:", e.message);
    });
  getData(endpointurl);
}

function buildFilters(data) {
  console.log("hi");
  // console.log(data.fields[10].properties.option_list);
  const genres = data.fields[10].properties.option_list.split(", ");
  genres.forEach((genre) => {
    const template = document.querySelector(".genre").content;
    const clone = template.cloneNode(true);
    const inputEl = clone.querySelector("input");
    inputEl.name = genre;
    inputEl.id = genre;
    inputEl.addEventListener("change", reLoad);
    const formEl = document.querySelector("form");
    const labelEl = clone.querySelector("label");
    labelEl.setAttribute("for", genre);
    labelEl.textContent = genre;

    formEl.appendChild(clone);

    function reLoad(evt) {
      const listChecked = formEl.querySelectorAll("input:checked");
      let listGenresChecked = [];
      console.log(listChecked);
      listChecked.forEach((genreChosen) => {
        listGenresChecked.push('"' + genreChosen.id + '"');
      });
      //listGenresChecked.;
      //console.log(listGenresChecked.toString());

      const genresCheckedString = listGenresChecked.toString();
      console.log(genresCheckedString);
      const newUrl =
        'https://s2021-8556.restdb.io/rest/great-songs?q={"genres":{"$in":[' +
        genresCheckedString +
        "]}}";
      console.log(newUrl);
      mainEl.innerHTML = "";
      document.querySelector(".preloader").classList.remove("hide");
      getData(newUrl);
    }

    //
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
      show(data);
    })
    .catch((e) => {
      //Woops, something went wrong
      console.error("An error occured:", e.message);
    });
  // document.querySelectorAll("input").forEach((box) => {
  //   box.addEventListener("change", hey);
  // });
}

// function hey() {
//   alert("hey");
// }
/* async function getData() {
  const response = await fetch(url, options);
  const data = await response.json();
  show(data);
  //console.log(data);
} */

function show(data) {
  console.table(data);
  data.forEach((song) => {
    const template = document.querySelector(".song").content;
    const clone = template.cloneNode(true);

    clone.querySelector("h2").textContent = song.title;

    const h4_span = clone.querySelector("h4 span");
    h4_span.textContent = song.artist;

    // clone.querySelector("p").textContent = person.email;
    // clone.querySelector("img").src = mediaurl + person.image[0];

    const ytLink = "https://www.youtube.com/embed/" + song.youtube_embed;
    clone.querySelector("iframe").src = ytLink;

    const img = clone.querySelector("img");
    img.src = song.img;
    img.alt = song.artist;
    clone.querySelector("figcaption").innerHTML =
      "Image attribution: " + song.img_attribution;

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
    mainEl.appendChild(clone);
  });
  document.querySelector(".preloader").classList.add("hide");
}

//getData();
window.addEventListener("DOMContentLoaded", getNav);

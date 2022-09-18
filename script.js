//https://github.com/lacjkea/music-site
//https://lacjkea.github.io/music-site/

//https://s2021-8556.restdb.io/rest/great-songs?apikey=6034ed655ad3610fb5bb655d
//https://s2021-8556.restdb.io/rest/great-songs?q={%22artist%22:%22BABYMETAL%22}&apikey=6034ed655ad3610fb5bb655d

const mainEl = document.querySelector("main");

//alert("hey");
// end point
const endpointurl = "https://s2021-8556.restdb.io/rest/great-songs?max=20";

// not working 22A - const mediaurl = "https://s2021-8556.restdb.io/media/";

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
      buildNavWithFilters(data);
    })
    .catch((e) => {
      //Woops, something went wrong
      console.error("An error occured:", e.message);
    });
  getData(endpointurl);
}

function buildNavWithFilters(data) {
  console.log("buildNavWithFilters");
  console.log("genres/option list:", data.fields[10].properties.option_list);
  const genres = data.fields[10].properties.option_list.split(", ");
  genres.forEach((genre) => {
    const template = document.querySelector(".genre").content;
    const clone = template.cloneNode(true);
    const inputEl = clone.querySelector("input");
    inputEl.name = genre;
    inputEl.setAttribute("checked", "checked");
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
      console.log("new Endpoint: ", newUrl);
      document.querySelector(".preloader").classList.remove("hide");
      mainEl.innerHTML = "";
      getData(newUrl);
    }
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
      mainEl.innerHTML = "";
      show(data);
    })
    .catch((e) => {
      //Woops, something went wrong
      document.querySelector("main").innerHTML =
        "<p>You haven't selected anything. Please select minimum one genre.</p>";
      document.querySelector(".preloader").classList.add("hide");
      console.error("An error occured:", e.message);
    });
  // document.querySelectorAll("input").forEach((box) => {
  //   box.addEventListener("change", hey);
  // });
}

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

//getData();
window.addEventListener("DOMContentLoaded", getNav);

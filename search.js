/* URLS including apikey (in the code below the APIKEY is sent with headers) 
TAKE A LOOK AT THE ENDPOINT FOR YOUR SEARCH...
"filter" is not fully working as expected - it's not matching inline strings) - only matches from the beginning of strings - e.g. "ABYMETAL" gives ZERO results
https://s2021-8556.restdb.io/rest/great-songs?apikey=6034ed655ad3610fb5bb655d&q={}&filter=ABYMETAL

Search in specific fields might work better - like
https://s2021-8556.restdb.io/rest/great-songs?apikey=6034ed655ad3610fb5bb655d&q={"artist": {"$regex" : "ABYMETAL"}} => two results as expected
 */

const form = document.querySelector("form");

console.log("form.elements:" + form.elements.length);
document.querySelector("button").addEventListener("click", submitSearch);

function submitSearch(e) {
  e.preventDefault();
  //alert(form.elements.query.value);
  const q = form.elements.query.value;
  //   alert("reading the form field: \n" + q);
  const url = "https://s2021-8556.restdb.io/rest/great-songs?q={}&filter=" + q;
  document.querySelector("p").textContent += `\n ${url}`;
  fetch(url, {
    method: "GET",
    headers: { "x-apikey": "6034ed655ad3610fb5bb655d" },
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      show(response, q);
    })
    .catch((err) => {
      console.error(err);
    });
}

function show(matches, q) {
  const section = document.querySelector("section");
  section.innerHTML = "";

  if (!matches.length) {
    // alert("Nothing found");
    section.innerHTML = "<p><em>Nothing found</em></p>";
  } else {
    matches.forEach((match) => {
      console.log("TheMatch: ", match);
      const template = document.querySelector("template").content;
      const copy = template.cloneNode(true);

      const h2Content = match.artist.replaceAll(
        q,
        '<span class="match-search">' + q + "</span>"
      );
      console.log(h2Content);

      copy.querySelector("h2").innerHTML = h2Content;

      copy.querySelector("h3").innerHTML = match.album.replaceAll(
        q,
        '<span class="red">' + q + "</span>"
      );
      section.appendChild(copy);
    });
  }
}

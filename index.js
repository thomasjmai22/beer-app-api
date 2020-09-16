"use strict";

const searchURL = "https://api.punkapi.com/v2/beers";
const foodURL = "https://api.edamam.com/search";
//api.edamam.com/search?q=chicken&app_id=&app_key=
//api.edamam.com/search?api_key=494bc5476292aed774e95c7f72f7cc6e&api_id=2ab32599&q=Spicy%20chicken%20tikka%20masala
const app_key = "494bc5476292aed774e95c7f72f7cc6e";
const app_id = "2ab32599";
// const randomURL = "https://api.punkapi.com/v2/beers/random";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
  console.log(responseJson);
  $("#results-list").empty();
  responseJson.forEach((beer) => {
    $("#results-list").append(
      `<li class="list">
              <h3>${beer.name}</h3>
              
              <p class="tagline">${beer.tagline}</p>
              <img class="beer-pic" src='${beer.image_url}'>
              <p><span class="title-descrip">Description: </span>${
                beer.description
              }</p>
              <section class="additionalInfo">
              <p class="title-descrip">Hops:</p>
              <ul>${beer.ingredients.hops
                .map((hop) => `<li>${hop.name} - ${hop.attribute}</li>`)
                .join("")}</ul>
              <p class="title-descrip">Malts:</p>
              <ul>${
                beer.ingredients.malt
                  ? beer.ingredients.malt
                      .map((malt) => `<li>${malt.name}</li>`)
                      .join("")
                  : "<li>None Listed</li>"
              }</ul>
              
              <p id="tip">PRO TIP: ${beer.brewers_tips}</p>
              </section>
              <div class="food_pairing">
              
                <h4>Food Pairings (click for recipe):</h4>
                ${beer.food_pairing
                  .map(
                    (food_pairing) =>
                      `<p><a class="food-pairing-api" href="">${food_pairing}</a></p>`
                  )
                  .join("")}
              </div>
              
              
              `
    );
  });
  //display the results section
  $("#results").removeClass("hidden");
}
//FOOD
function displayFoodResults(responseJson, el) {
  console.log(responseJson);
  const recipeURL = responseJson.hits[0].recipe.url;
  window.open(recipeURL);
  $(el)
    .attr("href", recipeURL)
    .removeClass("food-pairing-api")
    .attr("target", "_blank");
}

//FOOD
function getFood(q, el) {
  const foodParams = {
    q,
    app_id,
    app_key,
  };

  const queryString = formatQueryParams(foodParams); // per_page=25
  const url = foodURL + "?" + queryString;
  const options = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };

  //FOOD
  fetch(url, options, {
    mode: "no-cors",
    accept: "application/json",
    "Content-Type": "application/json",
  })
    .then((response) => {
      //console.log(response);
      return response.json();
    })
    .then((responseJson) => displayFoodResults(responseJson, el));
}

console.log(foodURL);

//function getRandomBeer(beer_name = "", per_page = 25) {
function getRandomBeer(per_page = 25) {
  const params = { per_page }; // {per_page: 25}
  /*if (beer_name != "") {
    params["beer_name"] = beer_name.replace(" ", "_");
  }*/

  const queryString = formatQueryParams(params); // per_page=25
  const url = searchURL + "?" + queryString;
  console.log(url);

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    // .then((responseJson) => getRandomBeer(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });

  //   fetch(randomURL)
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.json();
  //       }
  //       throw new Error(response.statusText);
  //     })
  //     .then((responseJson) => getRandomBeer(responseJson))
  //     .catch((err) => {
  //       $("#js-error-message").text(`Something went wrong: ${err.message}`);
  //     });
}

//FOOD
function watchFoodClick() {
  $("body").on("click", ".food_pairing a.food-pairing-api", (e) => {
    e.preventDefault();
    const food = $(e.target).text();
    getFood(food, e.target);
  });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const maxResults = $("#max-results").val();
    //const beer_name = $("#beer_name").val();
    //getRandomBeer(beer_name, maxResults);
    getRandomBeer(maxResults);
  });
}

function main() {
  watchForm();
  watchFoodClick();
}

$(main);

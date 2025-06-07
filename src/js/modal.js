"use strict";

const api_key = "c57ca76ab731221b15c53979859d9125";
const movie_id = "550"; // Example movie ID (e.g., Fight Club)
const url = `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${api_key}&language=en-US`;

let movies = [];

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    movies = data.results;
    console.log(movies);
  })
  .catch((error) => console.error("Error fetching data:", error));

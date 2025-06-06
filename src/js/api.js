"use strict"
const api_key = "c57ca76ab731221b15c53979859d9125";
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const posterDiv = document.getElementById("poster");
    const movies = data.results;

    // Clear the container
    posterDiv.innerHTML = "";

    // Loop through each movie and display the poster
    movies.forEach(movie => {
      const img = document.createElement("img");
      img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      img.alt = movie.title;
      img.style.width = "200px"; // optional
      img.style.margin = "10px";

      posterDiv.appendChild(img);
    });
  })
  .catch(err => console.error(err));

"use strict";
const api_key = "c57ca76ab731221b15c53979859d9125";
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;
const imgsrc = "https://image.tmdb.org/t/p/w300";
const cardcontainer = document.getElementById("postercontainer");

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const movies = data.results;
    console.log(movies);
    // Use map and return HTML string, then join it
    cardcontainer.innerHTML = movies
      .map((movie) => {
        return `
        <div
  class="flex flex-col w-[300px] h-[500px] bg-gray-900 rounded-lg overflow-hidden shadow-md"
>
  <img
    src="${imgsrc}${movie.poster_path}"
    alt="${movie.title}"
    class="w-full h-[400px] object-cover"
  />
  <div class="p-2 flex items-center justify-center h-[100px]">
    <h1 class="text-white text-center text-base font-semibold line-clamp-2">
      ${movie.title}
    </h1>
  </div>
</div>
        `;
      })
      .join("");
  })
  .catch((err) => console.error(err));

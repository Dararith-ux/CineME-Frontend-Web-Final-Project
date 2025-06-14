"use strict";
const movieList = document.getElementById("movieList");
const watchlist = document.getElementById("watchlist");
const watchlistButton = document.getElementById("watchLaterBtn");
const welcomepage = document.getElementById("welcome");
const Addmodal = document.getElementById("addMovieModal");
const emptystate = document.getElementById("empty");
watchlistButton.addEventListener("click", () => {
  watchlist.classList.remove("hidden");
  Addmodal.classList.add("hidden");
  welcomepage.classList.add("hidden");
  emptystate.classList.add("hidden");
});
window.onload = function () {
  let list_to_show = getCookieArray("watch_later");
  list_to_show.forEach(async (movieID) => {
    const url = `
https://api.themoviedb.org/3/movie/${movieID}?api_key=${api_key}`;
    const initial = await fetch(url);
    const data = await initial.json();
    const li = document.createElement("li");
    li.className =
      "bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition duration-300 flex justify-between items-center px-[50px]";
    li.innerHTML = `
      <div class="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 gap-6 text-center sm:text-left">
        <img class="h-[150px] max-w-full rounded-lg" src="https://image.tmdb.org/t/p/w300${
          data.poster_path
        }" alt="${data.title}" />
        <div class="flex flex-col gap-1">
          <p class="text-xl sm:text-2xl md:text-3xl font-semibold">${
            data.title
          }</p>
          <p class="text-sm sm:text-base md:text-lg text-gray-300">${
            data.release_date || "Unknown"
          }</p>
          <p class="text-sm sm:text-base md:text-lg text-gray-300">${(
            data.original_language || ""
          ).toUpperCase()}</p>
          <p class="text-sm sm:text-base md:text-lg text-gray-300">${
            data.vote_average || "N/A"
          } / 10</p>
        </div>
      </div>
      <button class="mt-4 sm:mt-0 bg-green-500 text-black px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base md:text-lg font-semibold rounded-lg transition duration-300 hover:bg-green-600">
        Watch now
      </button>
    `;
    movieList.appendChild(li);
  });
};

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const watchlist = document.getElementById("watchlist");
  const movieList = document.getElementById("movieList");

  let currentMovie = null;

  // Make the movie data accessible from api.js
  window.setCurrentMovieForWatchLater = function (movie) {
    currentMovie = movie;

    // Attach the event each time a movie is selected
    const addBtn = document.getElementById("add_to_watchlater");
    if (addBtn) {
      addBtn.onclick = function () {
        if (!currentMovie) return;

        const li = document.createElement("li");
        li.className =
          "bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition duration-300 flex justify-between items-center px-[50px]";

        li.innerHTML = `
          <div class="flex items-center">
            <img class="max-w-[100px]" src="https://image.tmdb.org/t/p/w300${currentMovie.poster_path}" alt="${currentMovie.title}" />
            <div class="pl-[20px] flex flex-col gap-1">
              <p class="text-3xl font-semibold">${currentMovie.title}</p>
              <p class="text-xl text-gray-300">${currentMovie.release_date || "Unknown"}</p>
              <p class="text-xl text-gray-300">${(currentMovie.original_language || "").toUpperCase()}</p>
              <p class="text-xl text-gray-300">${currentMovie.vote_average || "N/A"} / 10</p>
            </div>
          </div>
          <button class="bg-green-500 text-black p-[10px] h-[50px] font-semibold rounded-[10px]">Watch now</button>
        `;

        movieList.appendChild(li);
        watchlist?.classList.remove("hidden");
      };
    } else {
      console.warn("Add to watchlater button not found inside modal.");
    }
  };
});

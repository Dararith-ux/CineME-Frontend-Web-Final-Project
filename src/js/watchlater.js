"use strict";
  const movieList = document.getElementById("movieList");
  const watchlist = document.getElementById("watchlist");
  const watchlistButton = document.getElementById("watchLaterBtn");
  const welcomepage = document.getElementById("welcome");
  const emptystate = document.getElementById("empty");
  watchlistButton.addEventListener("click", ()=> {
    watchlist.classList.remove("hidden");
    welcomepage.classList.add("hidden");
    emptystate.classList.add("hidden");
  })
window.onload = function () {
  let list_to_show = getCookieArray("watch_later")
  list_to_show.forEach(async (movieID) => {
    const url = `
https://api.themoviedb.org/3/movie/${movieID}?api_key=${api_key}`
    const initial = await fetch(url)
    const data = await initial.json()
    const li = document.createElement("li");
    li.className =
      "bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition duration-300 flex justify-between items-center px-[50px]";
    li.innerHTML = `
      <div class="flex items-center">
        <img class="max-w-[100px]" src="https://image.tmdb.org/t/p/w300${data.poster_path}" alt="${data.title}" />
        <div class="pl-[20px] flex flex-col gap-1">
          <p class="text-3xl font-semibold">${data.title}</p>
          <p class="text-xl text-gray-300">${data.release_date || "Unknown"}</p>
          <p class="text-xl text-gray-300">${(data.original_language || "").toUpperCase()}</p>
          <p class="text-xl text-gray-300">${data.vote_average || "N/A"} / 10</p>
        </div>
      </div>
      <button class="bg-green-500 text-black p-[10px] h-[50px] font-semibold rounded-[10px]">Watch now</button>
    `;
    movieList.appendChild(li);
  })
}


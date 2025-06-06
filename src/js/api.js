"use strict";
const api_key = "c57ca76ab731221b15c53979859d9125";
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;
const imgsrc = "https://image.tmdb.org/t/p/w300";
const cardcontainer = document.getElementById("postercontainer");

let movies = []; // make movies accessible globally

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    movies = data.results; // store globally
    cardcontainer.innerHTML = movies
      .map((movie, index) => {
        function formatReleaseDate(dateString) {
          const date = new Date(dateString);
          const day = date.getDate().toString().padStart(2, '0');
          const month = date.toLocaleString('en-US', { month: 'long' });
          const year = date.getFullYear();
          return `${day} ${month} ${year}`;
        }

        const formattedDate = formatReleaseDate(movie.release_date);

        return `
          <div class="flex flex-col w-[270px] h-[460px] mb-[20px]">
            <img
              onclick="openModal(${index})"
              src="${imgsrc}${movie.poster_path}"
              alt="${movie.title}"
              class="w-full h-[380px] object-cover rounded-xl shadow-xl"
            />
            <div class="flex flex-col justify-start items-start h-[80px] px-2 mt-2">
              <h1 class="text-yellow-500 text-xl font-mulish-medium">
                ${formattedDate}
              </h1>
              <h1 class="text-white text-xl pt-1 font-mulish-medium break-words leading-snug">
                ${movie.title}
              </h1>
            </div>
          </div>
        `;
      })
      .join("");
  })
  .catch((err) => console.error(err));

function openModal(index) {
  const movie = movies[index];

  function formatReleaseDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal-movieTitle").innerText = movie.title;
  document.getElementById("modal-moviePoster").src = `${imgsrc}${movie.poster_path}`;
  document.getElementById("modal-movieDate").innerText = formatReleaseDate(movie.release_date);
  document.getElementById("modal-movieRate").innerText = `${movie.vote_average} / 10`;
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

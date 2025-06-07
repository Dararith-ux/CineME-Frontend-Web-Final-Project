"use strict";

const api_key = "c57ca76ab731221b15c53979859d9125";
const imgsrc = "https://image.tmdb.org/t/p/w300";
const cardcontainer = document.getElementById("postercontainer");
let movies = [];
let currentPage = 1;

function formatReleaseDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function loadPage(page) {
  if (page < 1) return;
  currentPage = page;
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page}`)
    .then((res) => res.json())
    .then((data) => {
      movies = data.results;
      renderMovies();
      highlightCurrentPage();
    });
}

function renderMovies() {
  cardcontainer.innerHTML = movies.map((movie, index) => {
    const formattedDate = formatReleaseDate(movie.release_date);
    return `
      <div class="flex flex-col w-[270px] h-[460px] mb-[20px]">
        <img
          onclick="openModal(${index})"
          src="${imgsrc}${movie.poster_path}"
          alt="${movie.title}"
          class="w-full h-[380px] object-cover rounded-xl shadow-xl cursor-pointer"
        />
        <div class="flex flex-col justify-start items-start h-[80px] px-2 mt-2">
          <h1 class="text-yellow-500 text-xl font-mulish-medium">${formattedDate}</h1>
          <h1 class="text-white text-xl pt-1 font-mulish-medium break-words leading-snug">${movie.title}</h1>
        </div>
      </div>
    `;
  }).join("");
}

function highlightCurrentPage() {
  const pageButtons = document.querySelectorAll(".page-button");
  pageButtons.forEach((btn, i) => {
    btn.classList.remove("border-yellow-500");
    if (parseInt(btn.innerText) === currentPage) {
      btn.classList.add("border-yellow-500");
    }
  });
}

function openModal(index) {
  const movie = movies[index];
  const formattedDate = formatReleaseDate(movie.release_date);

  // Populate basic info
  document.getElementById("modal").classList.remove("hidden");
  document.getElementById("modal-movieTitle").innerText = movie.title;
  document.getElementById("modal-moviePoster").src = `${imgsrc}${movie.poster_path}`;
  document.getElementById("modal-movieDate").innerText = formattedDate;
  document.getElementById("modal-movieRate").innerText = `${movie.vote_average} / 10`;
  document.getElementById("modal-movieOverview").innerText = movie.overview;
  document.getElementById("modal-movieLang").innerText = `Language: ${movie.original_language.toUpperCase()}`;

  // Fetch trailer
  fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${api_key}&language=en-US`)
    .then(res => res.json())
    .then(videoData => {
      const trailer = videoData.results.find(v => v.site === "YouTube" && v.type === "Trailer");
      const iframe = document.querySelector("#modal iframe");
      if (trailer) {
        iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
      } else {
        iframe.src = "";
        iframe.replaceWith("No trailer available.");
      }
    });
}
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.querySelector("#modal iframe").src = ""; // stop video
}

// Bind pagination buttons
document.querySelectorAll(".page-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const page = parseInt(btn.innerText);
    loadPage(page);
  });
});

// Initial load
loadPage(currentPage);
"use strict";

const api_key = "c57ca76ab731221b15c53979859d9125";
const imgsrc = "https://image.tmdb.org/t/p/w300";
const cardcontainer = document.getElementById("postercontainer");
let movies = [];
let currentPage = 1;

function formatReleaseDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// ✅ Show custom movie before fetching API movies
function renderCustomMovie() {
  const movieData = localStorage.getItem("customMovies");
  if (!movieData) return;
  const movieList = JSON.parse(movieData);
  movieList.forEach((movie) => {
    const card = document.createElement("div");
    card.classList = "flex flex-col w-[270px] h-[460px] mb-[20px]";
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class=" w-full h-[380px] object-cover rounded-xl shadow-xl cursor-pointer"/>
      <div class="flex flex-col justify-start items-start h-[80px] px-2 mt-2">
          <h1 class="text-yellow-500 text-xl font-mulish-medium">${movie.releaseDate}</h1>
          <h1 class="text-white text-xl pt-1 font-mulish-medium break-words leading-snug">${movie.title}</h1>
        </div> 
    `;
    cardcontainer.prepend(card);
  });
}

// 🔁 Fetch API movies
function loadPage(page) {
  if (page < 1) return;
  currentPage = page;
  fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page}`
  )
    .then((res) => res.json())
    .then((data) => {
      movies = data.results;
      renderMovies();
      highlightCurrentPage();
    });
}

// 🎬 Render TMDB API movies
function renderMovies() {
  cardcontainer.innerHTML += movies
    .map((movie, index) => {
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
    })
    .join("");
}

function highlightCurrentPage() {
  const pageButtons = document.querySelectorAll(".page-button");
  pageButtons.forEach((btn) => {
    btn.classList.remove("border-yellow-500");
    if (parseInt(btn.innerText) === currentPage) {
      btn.classList.add("border-yellow-500");
    }
  });
}

// 🍪 Cookie watch later logic
let watch_later = [];

function getCookieArray(name) {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((row) => row.startsWith(name + "="));
  if (!found) return [];

  try {
    return JSON.parse(decodeURIComponent(found.split("=")[1]));
  } catch (err) {
    console.error(`Error parsing cookie ${name}:`, err);
    return [];
  }
}

window.onload = function () {
  watch_later = getCookieArray("watch_later");
};

function add_to_watchlater(movieID) {
  if (!watch_later.includes(movieID)) {
    watch_later.push(movieID);
    document.cookie = `watch_later=${JSON.stringify(watch_later)}; path=/;`;
  } else {
    watch_later = watch_later.filter((id) => id !== movieID);
    document.cookie = `watch_later=${JSON.stringify(watch_later)}; path=/;`;
  }
}

// 📽️ Modal logic
function openModal(index) {
  const movie = movies[index];
  if (typeof setCurrentMovieForWatchLater === "function") {
    setCurrentMovieForWatchLater(movie);
  }

  const formattedDate = formatReleaseDate(movie.release_date);
  document.getElementById("modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";

  document.getElementById("modal-movieTitle").innerText = movie.title;
  document.getElementById(
    "modal-moviePoster"
  ).src = `${imgsrc}${movie.poster_path}`;
  document.getElementById("modal-movieDate").innerText = formattedDate;
  document.getElementById(
    "modal-movieRate"
  ).innerText = `${movie.vote_average} / 10`;
  document.getElementById("modal-movieOverview").innerText = movie.overview;
  document.getElementById(
    "modal-movieLang"
  ).innerText = `Language: ${movie.original_language.toUpperCase()}`;
  document.getElementById("add_to_watchlater").onclick = function () {
    add_to_watchlater(movie.id);
  };

  const iframe = document.querySelector("#modal iframe");
  const trailerContainer = iframe.parentElement;
  iframe.src = "";
  iframe.classList.remove("hidden");

  const oldFallback = trailerContainer.querySelector(".no-trailer");
  if (oldFallback) oldFallback.remove();

  fetch(
    `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${api_key}&language=en-US`
  )
    .then((res) => res.json())
    .then((videoData) => {
      const trailer = videoData.results.find(
        (v) => v.site === "YouTube" && v.type === "Trailer"
      );
      if (trailer) {
        iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
      } else {
        iframe.classList.add("hidden");
        const fallback = document.createElement("div");
        fallback.textContent = "🎬 No trailer available for this movie.";
        fallback.className =
          "no-trailer text-center text-cyan-300 text-lg mt-4";
        trailerContainer.appendChild(fallback);
      }
    })
    .catch((err) => console.error("Trailer fetch error:", err));
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.body.style.overflow = "auto";

  const iframe = document.querySelector("#modal iframe");
  iframe.src = "";
  iframe.classList.remove("hidden");

  const trailerContainer = iframe.parentElement;
  const fallback = trailerContainer.querySelector(".no-trailer");
  if (fallback) fallback.remove();
}

// Pagination button bindings
document.querySelectorAll(".page-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const page = parseInt(btn.innerText);
    loadPage(page);
  });
});

// ✅ First show custom movie, then fetch API movies
renderCustomMovie();
loadPage(currentPage);

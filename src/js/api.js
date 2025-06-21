"use strict";

const api_key = "c57ca76ab731221b15c53979859d9125";
const imgsrc = "https://image.tmdb.org/t/p/w300";
const cardcontainer = document.getElementById("postercontainer");
const nowShowing = document.getElementById("nowShowing");
const addedMovie = document.getElementById("addedMovie");
let movies = [];
let currentPage = 1;
let isEditMode = false;


// Format release date
function formatReleaseDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function deleteCustomMovie(index) {
  const movieData = localStorage.getItem("customMovies");
  if (!movieData) return;

  let movieList = JSON.parse(movieData);
  movieList.splice(index, 1);

  localStorage.setItem("customMovies", JSON.stringify(movieList));
  renderCustomMovie(); // 👈 this will re-show with delete buttons if isEditMode is true
}


// Render custom movies from localStorage
function renderCustomMovie() {
  cardcontainer.innerHTML = "";
  const movieData = localStorage.getItem("customMovies");
  if (!movieData) return;

  const movieList = JSON.parse(movieData);

  movieList.forEach((movie, index) => {
    const card = document.createElement("div");
    const formattedCusMV = formatReleaseDate(movie.releaseDate)
    card.className = "flex flex-col w-[270px] h-[460px] mb-[20px] relative";

    card.innerHTML = `
      ${isEditMode ? `<button class="delete-btn absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm" data-index="${index}">✖</button>` : ""}
      <img src="${movie.poster}" alt="${movie.title}" class="w-full h-[380px] object-cover rounded-xl shadow-xl cursor-pointer"/>
      <div class="flex flex-col justify-start items-start h-[80px] px-2 mt-2">
        <h1 class="text-yellow-500 text-xl font-mulish-medium">${formattedCusMV}</h1>
        <h1 class="text-white text-xl pt-1 font-mulish-medium break-words leading-snug">${movie.title}</h1>
      </div>
    `;
    cardcontainer.appendChild(card);
  });

  // ✅ Bind delete buttons (important)
  if (isEditMode) {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        deleteCustomMovie(index);
      });
    });
  }
}


// Load movies from TMDB
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

const pageButton = document.querySelectorAll(".page-button");
pageButton.forEach(button =>{
  button.addEventListener("click", ()=>{
    button.forEach(b => b.classList.remove("border-yellow-500"));
    this.button.classList.add("border-yellow-500");
  });
});

// Render TMDB movies
function renderMovies() {
  cardcontainer.innerHTML = movies
    .map((movie, index) => {
      const formattedDate = formatReleaseDate(movie.release_date);
      return `
        <div class="flex flex-col w-[270px] h-[460px] mb-[20px]">
          <img onclick="openModal(${index})"
            src="${imgsrc}${movie.poster_path}"
            alt="${movie.title}"
            class="w-full h-[380px] object-cover rounded-xl shadow-xl cursor-pointer" />
          <div class="flex flex-col justify-start items-start h-[80px] px-2 mt-2">
            <h1 class="text-yellow-500 text-xl font-mulish-medium">${formattedDate}</h1>
            <h1 class="text-white text-xl pt-1 font-mulish-medium break-words leading-snug">${movie.title}</h1>
          </div>
        </div>`;
    })
    .join("");
}



// Watch Later cookie management
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

function add_to_watchlater(movieID) {
  if (!watch_later.includes(movieID)) {
    watch_later.push(movieID);
  } else {
    watch_later = watch_later.filter((id) => id !== movieID);
  }
  document.cookie = `watch_later=${JSON.stringify(watch_later)}; path=/;`;
}

// Modal handling
function openModal(index) {
  const movie = movies[index];
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
  const fallback = iframe.parentElement.querySelector(".no-trailer");
  if (fallback) fallback.remove();
}

function setActiveTab(activeId) {
  const tabs = [nowShowing, addedMovie];
  tabs.forEach((tab) => {
    if (tab.id === activeId) {
      tab.classList.add(
        "border-yellow-400",
        "text-yellow-400",
        "font-semibold"
      );
      tab.classList.remove("border-transparent", "text-white");
    } else {
      tab.classList.remove(
        "border-yellow-400",
        "text-yellow-400",
        "font-semibold"
      );
      tab.classList.add("border-transparent", "text-white");
    }
  });
}

// Bind pagination buttons
document.querySelectorAll(".page-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const page = parseInt(btn.innerText);
    loadPage(page);
  });
});

// Toggle between TMDB and Custom Movies
nowShowing.addEventListener("click", () => {
  cardcontainer.innerHTML = "";
  document.getElementById("pageBtn").classList.remove("hidden");
  document.getElementById("editBtn").classList.add("hidden");
  loadPage(currentPage);
  setActiveTab("nowShowing");
});
addedMovie.addEventListener("click", () => {
  document.getElementById("pageBtn").classList.add("hidden");
  document.getElementById("editBtn").classList.remove("hidden");
  renderCustomMovie();
  setActiveTab("addedMovie");
});

document.getElementById("editBtn").addEventListener("click", () => {
  isEditMode = true;
  document.getElementById("confirmEdit").classList.remove("hidden");
  renderCustomMovie(); // 🔁 Re-render to show delete buttons
});

document.querySelectorAll(".canSave").forEach((btn) => {
  btn.addEventListener("click", () => {
    isEditMode = false;
    document.getElementById("confirmEdit").classList.add("hidden");
    renderCustomMovie(); // 🔁 Re-render to hide delete buttons
  });
});

// Initial load
window.onload = function () {
  watch_later = getCookieArray("watch_later");
  renderCustomMovie();
  loadPage(currentPage);
  setActiveTab("nowShowing"); // 🔥 default active tab
  highlightCurrentPage();
};

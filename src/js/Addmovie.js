"use strict";

const CUSTOM_MOVIES_KEY = "customMovies";

function parseStoredMovies() {
  try {
    const raw = localStorage.getItem(CUSTOM_MOVIES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read custom movies from localStorage:", error);
    return [];
  }
}

function saveStoredMovies(movieList) {
  localStorage.setItem(CUSTOM_MOVIES_KEY, JSON.stringify(movieList));
}

function createLocalMovieId() {
  if (window.crypto?.randomUUID) {
    return `local-${window.crypto.randomUUID()}`;
  }
  return `local-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function normalizeMovieKey(title, releaseDate) {
  return `${title.trim().toLowerCase()}::${releaseDate || ""}`;
}

function notifyCustomMovieUpdate() {
  window.dispatchEvent(new CustomEvent("customMoviesUpdated"));
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("addMovieCard");
  const addModal = document.getElementById("addMovieModal");
  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const extraCancelBtn = document.getElementById("addMovieSubmit");
  const welcomePage = document.getElementById("welcome");
  const watchlist = document.getElementById("watchlist");
  const form = document.getElementById("addMovieForm");
  const submitBtn = document.getElementById("fetchDetailsBtn");

  if (!form || !openBtn || !addModal) return;

  const hideModal = () => {
    addModal.classList.add("hidden");
  };

  openBtn.addEventListener("click", () => {
    addModal.classList.remove("hidden");
    welcomePage?.classList.add("hidden");
    watchlist?.classList.add("hidden");
  });

  [closeBtn, cancelBtn, extraCancelBtn].forEach((btn) => {
    btn?.addEventListener("click", (event) => {
      event.preventDefault();
      hideModal();
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("movieTitle")?.value.trim() || "";
    const releaseDate = document.getElementById("movieDate")?.value || "";
    const genre = document.getElementById("movieGenre")?.value || "";
    const rating = document.getElementById("movieRating")?.value.trim() || "";
    const poster = document.getElementById("moviePoster")?.value.trim() || "";
    const description =
      document.getElementById("movieDescription")?.value.trim() || "";

    if (!title || !releaseDate) {
      alert("Please enter both movie title and release date.");
      return;
    }

    const storedMovies = parseStoredMovies();
    const candidateKey = normalizeMovieKey(title, releaseDate);
    const duplicate = storedMovies.some((movie) => {
      return normalizeMovieKey(movie.title || "", movie.releaseDate || movie.release_date) === candidateKey;
    });

    if (duplicate) {
      alert("This movie is already in your added list.");
      return;
    }

    const movie = {
      id: createLocalMovieId(),
      title,
      releaseDate,
      genre,
      rating,
      poster: poster || "https://via.placeholder.com/270x380?text=No+Image",
      description,
      createdAt: new Date().toISOString(),
    };

    storedMovies.unshift(movie);
    saveStoredMovies(storedMovies);
    notifyCustomMovieUpdate();

    form.reset();
    hideModal();
    submitBtn?.classList.add("pulse-animation");
    setTimeout(() => submitBtn?.classList.remove("pulse-animation"), 250);
    alert("Movie added successfully.");
  });
});

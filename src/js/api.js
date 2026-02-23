"use strict";

const api_key = "c57ca76ab731221b15c53979859d9125";
const imgsrc = "https://image.tmdb.org/t/p/w300";
const CUSTOM_MOVIES_KEY = "customMovies";
const cardcontainer = document.getElementById("postercontainer");
const nowShowing = document.getElementById("nowShowing");
const addedMovie = document.getElementById("addedMovie");
const isMoviePage = Boolean(cardcontainer && nowShowing && addedMovie);
let movies = [];
let currentPage = 1;
let isEditMode = false;

// ========== ENHANCED ANIMATION SYSTEM ==========

// Scroll tracking variables
let lastScrollTop = 0;
let scrollDirection = "down";
let isScrolling = false;
let scrollTimer = null;
let animationQueue = [];

// Track scroll direction and speed
function trackScrollDirection() {
  const currentScrollTop =
    window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > lastScrollTop) {
    scrollDirection = "down";
  } else {
    scrollDirection = "up";
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  isScrolling = true;

  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    isScrolling = false;
  }, 200);
}

// Enhanced Intersection Observer with your original style + stability fix
const observerOptions = {
  root: null,
  rootMargin: "0px 0px -80px 0px",
  threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const element = entry.target;

    if (entry.isIntersecting) {
      // Skip if already animated
      if (element.classList.contains("animate-in")) return;

      // Calculate delay based on scroll context (your original logic)
      let baseDelay = 0;

      if (scrollDirection === "up") {
        baseDelay = 300; // Your original longer delay when scrolling up
      } else {
        baseDelay = isScrolling ? 150 : 100;
      }

      // Add stagger based on element position (your original stagger)
      const elementIndex = Array.from(element.parentNode.children).indexOf(
        element
      );
      const staggerDelay = elementIndex * 80;

      const totalDelay = baseDelay + staggerDelay;

      // Queue animation to prevent overwhelming (your original system)
      animationQueue.push({
        element: element,
        delay: totalDelay,
      });

      processAnimationQueue();
    } else {
      // FIXED: Only apply gentle exit animation when scrolling away fast AND completely out of view
      const rect = element.getBoundingClientRect();
      const isCompletelyOutOfView = rect.bottom < -200 || rect.top > window.innerHeight + 200;
      
      // Only hide if completely out of view AND scrolling fast (much more conservative)
      if (isCompletelyOutOfView && scrollDirection === "down" && isScrolling) {
        entry.target.classList.remove("animate-in");
        entry.target.classList.add("animate-out");
        
        // Remove animate-out class after animation to prevent permanent hiding
        setTimeout(() => {
          entry.target.classList.remove("animate-out");
        }, 500);
      }
    }
  });
}, observerOptions);

function safeJsonParse(value, fallback = []) {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    return fallback;
  }
}

function getStoredCustomMovies() {
  const raw = localStorage.getItem(CUSTOM_MOVIES_KEY);
  if (!raw) return [];
  const parsed = safeJsonParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveStoredCustomMovies(movieList) {
  localStorage.setItem(CUSTOM_MOVIES_KEY, JSON.stringify(movieList));
}

function normalizeCustomMovie(movie) {
  const idValue = String(movie.id ?? "");
  const normalizedId = idValue.startsWith("local-") ? idValue : `local-${idValue}`;

  return {
    id: normalizedId,
    title: movie.title || "Untitled Movie",
    release_date: movie.releaseDate || movie.release_date || "",
    poster_path: null,
    poster_url:
      movie.poster || "https://via.placeholder.com/270x380?text=No+Image",
    overview: movie.description || "No description provided.",
    vote_average: Number(movie.rating) || 0,
    original_language: (movie.language || "N/A").toLowerCase(),
    genre: movie.genre || "",
    isCustom: true,
    localId: normalizedId,
  };
}

function getCustomMoviesForDisplay() {
  return getStoredCustomMovies().map(normalizeCustomMovie);
}

function mergeMoviesById(movieList) {
  const seen = new Set();
  return movieList.filter((movie) => {
    const key = String(movie?.id ?? "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getMoviePosterUrl(movie) {
  if (movie.poster_url) return movie.poster_url;
  if (movie.poster) return movie.poster;
  if (movie.poster_path) return `${imgsrc}${movie.poster_path}`;
  return "https://via.placeholder.com/270x380?text=No+Image";
}

function renderGridMessage(title, subtitle = "", toneClass = "text-gray-300") {
  if (!cardcontainer) return;
  cardcontainer.innerHTML = `
    <div class="col-span-full mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md">
      <p class="text-xl font-semibold ${toneClass}">${title}</p>
      ${subtitle ? `<p class="mt-2 text-sm text-white/60">${subtitle}</p>` : ""}
    </div>
  `;
  cardcontainer.classList.add("active");
}

function formatMovieRating(movie) {
  const rating = Number(movie.vote_average);
  if (!Number.isFinite(rating) || rating <= 0) return "N/A";
  return rating.toFixed(1);
}

async function fetchJson(url, errorMessage) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${errorMessage} (${response.status})`);
  }
  return response.json();
}

// Process animation queue with intelligent batching
function processAnimationQueue() {
  if (animationQueue.length === 0) return;

  // Process up to 4 animations at once for better performance
  const batch = animationQueue.splice(0, 4);

  batch.forEach(({ element, delay }) => {
    setTimeout(() => {
      if (element && element.parentNode) {
        element.classList.add("animate-in");
        element.classList.remove("animate-out");
      }
    }, delay);
  });

  // Process remaining queue after a brief pause
  if (animationQueue.length > 0) {
    setTimeout(() => processAnimationQueue(), 150);
  }
}

// Comprehensive animation styles
function addAnimationStyles() {
  if (document.getElementById("scroll-animations")) return;

  const style = document.createElement("style");
  style.id = "scroll-animations";
  style.textContent = `
    .movie-card {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
      transition: all 0.6s cubic-bezier(0.2, 0.8, 0.3, 1);
      will-change: transform, opacity;
    }
    
    .movie-card.animate-in {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    
    .movie-card.animate-out {
      opacity: 0.3;
      transform: translateY(10px) scale(0.98);
      transition: all 0.4s ease;
    }
    
    .movie-card:hover {
      transform: translateY(-8px) scale(1.03);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      transition: all 0.4s ease;
    }
    
    /* Loading animations */
    .loading-shimmer {
      background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    
    .page-transition {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.5s ease;
    }
    
    .page-transition.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s ease;
    }
    
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
    
    .pulse-animation {
      animation: pulse 0.3s ease-in-out;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    /* Modal animations */
    .modal-enter {
      opacity: 0;
      transform: scale(0.9);
    }
    
    .modal-enter-active {
      opacity: 1;
      transform: scale(1);
      transition: all 0.3s ease;
    }
    
    .modal-exit {
      opacity: 1;
      transform: scale(1);
    }
    
    .modal-exit-active {
      opacity: 0;
      transform: scale(0.9);
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

// Initialize animation system
function initializeAnimations() {
  addAnimationStyles();

  // Add scroll tracking with passive listeners for performance
  window.addEventListener("scroll", trackScrollDirection, { passive: true });

  // Throttled parallax effects
  let parallaxTicking = false;

  function updateParallaxEffects() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".parallax-bg");

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.3;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });

    parallaxTicking = false;
  }

  function requestParallaxTick() {
    if (!parallaxTicking) {
      requestAnimationFrame(updateParallaxEffects);
      parallaxTicking = true;
    }
  }

  window.addEventListener("scroll", requestParallaxTick, { passive: true });
}

// Enhanced loading animation
function showLoadingAnimation() {
  cardcontainer.innerHTML = "";
  cardcontainer.classList.add("page-transition");

  for (let i = 0; i < 8; i++) {
    const skeleton = document.createElement("div");
    skeleton.className =
      "flex flex-col w-[270px] h-[460px] mb-[20px] loading-shimmer rounded-xl";
    skeleton.style.animationDelay = `${i * 0.1}s`;
    skeleton.innerHTML = `
      <div class="w-full h-[380px] loading-shimmer rounded-xl"></div>
      <div class="flex flex-col justify-start items-start h-[80px] px-2 mt-2">
        <div class="w-32 h-4 loading-shimmer rounded mb-2"></div>
        <div class="w-48 h-4 loading-shimmer rounded"></div>
      </div>
    `;
    cardcontainer.appendChild(skeleton);
  }

  setTimeout(() => {
    cardcontainer.classList.add("active");
  }, 50);
}

// Observe elements with cleanup
function observeElements() {
  // Clean up previous observations
  const existingCards = document.querySelectorAll(".movie-card");
  existingCards.forEach((card) => {
    observer.unobserve(card);
  });

  // Observe new cards with a small delay to allow DOM to settle
  setTimeout(() => {
    const newCards = document.querySelectorAll(".movie-card");
    newCards.forEach((card) => {
      observer.observe(card);
    });
  }, 100);
}

// ========== UTILITY FUNCTIONS ==========

// Format release date
function formatReleaseDate(dateString) {
  if (!dateString) return "Unknown release date";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unknown release date";
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Custom movie management
function deleteCustomMovie(movieId) {
  const movieList = getStoredCustomMovies();
  const updatedList = movieList.filter((movie, index) => {
    const currentId = String(movie.id ?? `legacy-${index}`);
    const normalizedCurrentId = currentId.startsWith("local-")
      ? currentId
      : `local-${currentId}`;
    return normalizedCurrentId !== String(movieId);
  });

  saveStoredCustomMovies(updatedList);
  renderCustomMovie();
}

// Enhanced custom movie rendering
function renderCustomMovie() {
  cardcontainer.innerHTML = "";
  cardcontainer.classList.remove("active");
  cardcontainer.classList.add("page-transition");

  const movieList = getStoredCustomMovies();

  if (movieList.length === 0) {
    cardcontainer.innerHTML = `
      <div class="col-span-full text-center text-gray-400 text-xl fade-in">
        <p>No custom movies added yet.</p>
        <p class="text-sm mt-2">Add your favorite movies to see them here!</p>
      </div>
    `;

    setTimeout(() => {
      cardcontainer.classList.add("active");
      document.querySelector(".fade-in").classList.add("visible");
    }, 200);
    return;
  }

  movieList.forEach((movie, index) => {
    const card = document.createElement("div");
    const normalizedMovie = normalizeCustomMovie(movie);
    const formattedDate = formatReleaseDate(normalizedMovie.release_date);
    card.className =
      "movie-card relative flex w-full max-w-[270px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 shadow-xl shadow-black/20";

    card.innerHTML = `
      ${
        isEditMode
          ? `<button class="delete-btn absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-300/30 bg-red-500/90 text-sm text-white shadow-lg transition hover:scale-105 hover:bg-red-600" data-movie-id="${normalizedMovie.id}" aria-label="Delete custom movie">✖</button>`
          : ""
      }
      <img src="${getMoviePosterUrl(normalizedMovie)}" alt="${
      normalizedMovie.title
    }" class="h-[360px] w-full rounded-xl object-cover shadow-xl cursor-pointer"/>
      <div class="flex min-h-[88px] flex-col justify-start items-start px-2 pb-2 pt-3">
        <h1 class="text-amber-300 text-sm md:text-base font-semibold">${formattedDate}</h1>
        <h1 class="text-white text-lg pt-1 font-semibold break-words leading-snug">${
          normalizedMovie.title
        }</h1>
      </div>
    `;
    cardcontainer.appendChild(card);
  });

  // Trigger animations
  setTimeout(() => {
    cardcontainer.classList.add("active");
    observeElements();

    // Staggered entrance animations
    const cards = document.querySelectorAll(".movie-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-in");
      }, index * 80); // Faster stagger
    });
  }, 150);

  // Bind delete functionality
  if (isEditMode) {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const movieId = btn.getAttribute("data-movie-id");
        const card = btn.closest(".movie-card");

        // Smooth exit animation
        card.style.transform = "scale(0.8) translateY(-30px)";
        card.style.opacity = "0";
        card.style.transition = "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)";

        setTimeout(() => {
          deleteCustomMovie(movieId);
        }, 400);
      });
    });
  }
}

// Enhanced page loading
const loadedPages = new Map(); // cache

function appendMovies() {
  renderMovies();
}

async function loadPage(page, append = false) {
  currentPage = page;
  highlightCurrentPage();

  try {
    const data = await fetchJson(
      `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=${page}`,
      "Error loading movies"
    );

    if (!data || !Array.isArray(data.results)) {
      throw new Error("Invalid movie response format");
    }

    const localMovies = page === 1 ? getCustomMoviesForDisplay() : [];
    const newMovies = mergeMoviesById([...localMovies, ...data.results]);
    movies = append ? mergeMoviesById([...movies, ...newMovies]) : newMovies;

    setTimeout(() => {
      append ? appendMovies(newMovies) : renderMovies();
      highlightCurrentPage();
    }, 300);
  } catch (error) {
    console.error("Error loading movies:", error);
    renderGridMessage(
      "Unable to load movies right now.",
      "Please check your connection and try again.",
      "text-red-300"
    );
  }
}

// Enhanced movie rendering
function renderMovies() {
  cardcontainer.innerHTML = "";
  cardcontainer.classList.remove("active");
  cardcontainer.classList.add("page-transition");

  movies.forEach((movie, index) => {
    const formattedDate = formatReleaseDate(movie.release_date);
    const card = document.createElement("div");
    card.className =
      "movie-card group flex w-full max-w-[270px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2.5 shadow-xl shadow-black/20";

    card.innerHTML = `
      <img onclick="openModal(${index})"
        src="${getMoviePosterUrl(movie)}"
        alt="${movie.title}"
        class="h-[360px] w-full rounded-xl object-cover shadow-xl cursor-pointer transition duration-300 group-hover:scale-[1.02]"
        loading="lazy" />
      <div class="flex min-h-[96px] flex-col justify-start items-start px-2 pb-2 pt-3">
        <div class="flex w-full items-center justify-between gap-2">
          <h1 class="text-amber-300 text-sm md:text-base font-semibold">${formattedDate}</h1>
          ${
            movie.isCustom
              ? '<span class="rounded-full border border-emerald-300/30 bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-200">Custom</span>'
              : ""
          }
        </div>
        <h1 class="text-white text-lg pt-1 font-semibold break-words leading-snug">${movie.title}</h1>
      </div>
    `;

    cardcontainer.appendChild(card);
  });

  // Trigger animations after DOM is ready
  setTimeout(() => {
    cardcontainer.classList.add("active");
    observeElements();
  }, 100);
}

// ========== WATCH LATER FUNCTIONALITY ==========

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

// ========== MODAL FUNCTIONALITY ==========

async function openModal(index) {
  const movie = movies[index];
  if (!movie) return;
  const formattedDate = formatReleaseDate(movie.release_date);
  const modal = document.getElementById("modal");

  modal.classList.remove("hidden");
  modal.classList.add("modal-enter");
  document.body.style.overflow = "hidden";

  // Smooth entrance animation
  setTimeout(() => {
    modal.classList.add("modal-enter-active");
  }, 15);

  document.getElementById("modal-movieTitle").innerText = movie.title;
  document.getElementById(
    "modal-moviePoster"
  ).src = getMoviePosterUrl(movie);
  document.getElementById("modal-movieDate").innerText = formattedDate;
  document.getElementById(
    "modal-movieRate"
  ).innerText = `${formatMovieRating(movie)} / 10`;
  document.getElementById("modal-movieOverview").innerText =
    movie.overview || "No overview available.";
  document.getElementById(
    "modal-movieLang"
  ).innerText = `Language: ${(movie.original_language || "N/A").toUpperCase()}`;
  const watchLaterButton = document.getElementById("add_to_watchlater");
  watchLaterButton.onclick = null;
  watchLaterButton.disabled = Boolean(movie.isCustom);
  watchLaterButton.classList.toggle("opacity-40", Boolean(movie.isCustom));
  watchLaterButton.classList.toggle("cursor-not-allowed", Boolean(movie.isCustom));
  if (!movie.isCustom) {
    watchLaterButton.onclick = function () {
      add_to_watchlater(movie.id);
    };
  }

  // Load trailer
  const iframe = document.querySelector("#modal iframe");
  const trailerContainer = iframe.parentElement;
  iframe.src = "";
  iframe.classList.remove("hidden");
  const oldFallback = trailerContainer.querySelector(".no-trailer");
  if (oldFallback) oldFallback.remove();

  if (movie.isCustom) {
    iframe.classList.add("hidden");
    const fallback = document.createElement("div");
    fallback.textContent = "Custom movie added locally. Trailer is unavailable.";
    fallback.className = "no-trailer text-center text-cyan-300 text-lg mt-4";
    trailerContainer.appendChild(fallback);
    return;
  }

  try {
    const videoData = await fetchJson(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${api_key}&language=en-US`,
      "Trailer fetch error"
    );
    const trailer = (videoData.results || []).find(
      (v) => v.site === "YouTube" && v.type === "Trailer"
    );

    if (trailer) {
      iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
      return;
    }

    iframe.classList.add("hidden");
    const fallback = document.createElement("div");
    fallback.textContent = "No trailer available for this movie.";
    fallback.className = "no-trailer text-center text-cyan-300 text-lg mt-4";
    trailerContainer.appendChild(fallback);
  } catch (err) {
    console.error("Trailer fetch error:", err);
    iframe.classList.add("hidden");
    const fallback = document.createElement("div");
    fallback.textContent = "Unable to load trailer right now.";
    fallback.className = "no-trailer text-center text-red-300 text-lg mt-4";
    trailerContainer.appendChild(fallback);
  }
}

function closeModal() {
  const modal = document.getElementById("modal");

  modal.classList.remove("modal-enter-active");
  modal.classList.add("modal-exit", "modal-exit-active");

  setTimeout(() => {
    modal.classList.add("hidden");
    modal.classList.remove("modal-enter", "modal-exit", "modal-exit-active");
    document.body.style.overflow = "auto";

    const iframe = document.querySelector("#modal iframe");
    iframe.src = "";
    iframe.classList.remove("hidden");
    const fallback = iframe.parentElement.querySelector(".no-trailer");
    if (fallback) fallback.remove();
  }, 400);
}

// ========== TAB AND NAVIGATION FUNCTIONALITY ==========

function setActiveTab(activeId) {
  const tabs = document.querySelectorAll(".tab-button");

  tabs.forEach((tab) => {
    if (tab.id === activeId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });
}

function highlightCurrentPage() {
  const buttons = document.querySelectorAll(".page-button");
  buttons.forEach((btn) => {
    btn.classList.remove("border-yellow-500", "bg-yellow-500", "text-black");
    btn.classList.add("border-transparent", "bg-[#2e2f3b]", "text-white");

    if (parseInt(btn.dataset.page) === currentPage) {
      btn.classList.remove("bg-[#2e2f3b]", "text-white");
      btn.classList.add("border-yellow-500", "bg-yellow-500", "text-black");
    }
  });
}

// ========== EVENT LISTENERS ==========

if (isMoviePage) {
  // Enhanced pagination
  document.querySelectorAll(".page-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.innerText, 10);

      btn.classList.add("pulse-animation");
      setTimeout(() => {
        btn.classList.remove("pulse-animation");
      }, 1500);

      loadPage(page);
    });
  });

  // Tab switching with smooth transitions
  addedMovie.addEventListener("click", () => {
    setActiveTab("addedMovie");

    document.getElementById("pageBtn")?.classList.add("hidden");
    document.querySelectorAll(".page-button").forEach((btn) => {
      btn.style.display = "none";
    });

    const currentViewText = Array.from(document.querySelectorAll("p")).find((p) =>
      p.textContent.trim().startsWith("Currently viewing:")
    );
    if (currentViewText?.parentNode) {
      currentViewText.parentNode.style.display = "none";
    }

    document.getElementById("editBtn")?.classList.remove("hidden");
    cardcontainer.innerHTML = "";
    cardcontainer.classList.remove("active");
    showLoadingAnimation();

    setTimeout(() => {
      renderCustomMovie();
    }, 600);
  });

  // Edit mode functionality
  document.getElementById("editBtn")?.addEventListener("click", () => {
    isEditMode = true;
    document.getElementById("confirmEdit")?.classList.remove("hidden");
    renderCustomMovie();
  });

  document.querySelectorAll(".canSave").forEach((btn) => {
    btn.addEventListener("click", () => {
      isEditMode = false;
      document.getElementById("confirmEdit")?.classList.add("hidden");
      renderCustomMovie();
    });
  });

  // Now Showing tab
  nowShowing.addEventListener("click", () => {
    setActiveTab("nowShowing");

    document.getElementById("pageBtn")?.classList.remove("hidden");
    document.querySelectorAll(".page-button").forEach((btn) => {
      btn.style.display = "block";
    });

    const currentViewText = Array.from(document.querySelectorAll("p")).find((p) =>
      p.textContent.trim().startsWith("Currently viewing:")
    );
    if (currentViewText?.parentNode) {
      currentViewText.parentNode.style.display = "block";
    }

    document.getElementById("editBtn")?.classList.add("hidden");
    cardcontainer.innerHTML = "";
    cardcontainer.classList.remove("active");
    movies = [];

    showLoadingAnimation();

    setTimeout(() => {
      loadPage(1);
    }, 400);
  });

  // ========== INITIALIZATION ==========
  document.addEventListener("DOMContentLoaded", () => {
    initializeAnimations();
    watch_later = getCookieArray("watch_later");

    window.addEventListener("customMoviesUpdated", () => {
      const activeTab = document.querySelector(".tab-button.active")?.id;
      if (activeTab === "addedMovie") {
        renderCustomMovie();
        return;
      }
      if (activeTab === "nowShowing" && currentPage === 1) {
        loadPage(1);
      }
    });

    showLoadingAnimation();

    setTimeout(() => {
      loadPage(currentPage);
      setActiveTab("nowShowing");
      highlightCurrentPage();
      setTimeout(observeElements, 300);
    }, 500);
  });
}

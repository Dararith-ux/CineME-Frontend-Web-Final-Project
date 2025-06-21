

  document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("addMovieCard");
    const Addmodal = document.getElementById("addMovieModal");
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const welcomepage = document.getElementById("welcome");
    const watchlist = document.getElementById("watchlist");

    // Open modal on button click
    openBtn.addEventListener("click", () => {
      Addmodal.classList.remove("hidden");
      welcomepage.classList.add("hidden");
      watchlist.classList.add("hidden");
    });
    // Close modal on X or Cancel
    [closeBtn, cancelBtn].forEach((btn) => {
      btn.addEventListener("click", () => {
        Addmodal.classList.add("hidden");
      });
    });
  });



document.addEventListener("DOMContentLoaded", function () {
  const fetchBtn = document.getElementById("fetchDetailsBtn");

  fetchBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const title = document.getElementById("movieTitle").value.trim();
    const release_Date = document.getElementById("movieDate").value;
    const genre = document.getElementById("movieGenre").value;
    const rating = document.getElementById("movieRating").value.trim();
    const poster = document.getElementById("moviePoster").value.trim();
    const description = document.getElementById("movieDescription").value.trim();

    if (!title || !release_Date) {
      alert("Please enter both title and year.");
      return;
    }

    const movie = {
  id: Date.now(),
  title: title,
  releaseDate: release_Date,
  poster: poster || "https://via.placeholder.com/270x380?text=No+Image",
  description: description
};

// 1. Get existing array from localStorage
const stored = localStorage.getItem("customMovies");
const movies = stored ? JSON.parse(stored) : [];

// 2. Add new movie to array
movies.unshift(movie); // Add to beginning

// 3. Save back to localStorage
localStorage.setItem("customMovies", JSON.stringify(movies));
    alert("✅ Movie added to local storage!");
    document.getElementById("addMovieForm").reset();
  });
});


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
    const year = document.getElementById("movieYear").value.trim();
    const genre = document.getElementById("movieGenre").value;
    const rating = document.getElementById("movieRating").value.trim();
    const poster = document.getElementById("moviePoster").value.trim();
    const description = document.getElementById("movieDescription").value.trim();

    if (!title || !year) {
      alert("Please enter both title and year.");
      return;
    }

    const movie = {
  title: title,
  releaseDate: `01 January ${year}`,
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


    // // Format
    // const formattedDate = `01 ${new Date().toLocaleString('en-US', { month: 'long' })} ${year}`;
    // const posterURL = poster || "https://via.placeholder.com/270x380?text=No+Image";

    // // Create movie card element
    // const movieCard = document.createElement("div");
    // movieCard.className = "flex flex-col w-[270px] h-[460px] mb-[20px]";
    // movieCard.innerHTML = `
    //   <img
    //     src="${posterURL}"
    //     alt="${title}"
    //     class="w-full h-[380px] object-cover rounded-xl shadow-xl"
    //   />
    //   <div class="flex flex-col justify-start items-start h-[80px] px-2 mt-2">
    //     <h1 class="text-yellow-500 text-xl font-mulish-medium">${formattedDate}</h1>
    //     <h1 class="text-white text-xl pt-1 font-mulish-medium break-words leading-snug">${title}</h1>
    //   </div>
    // `;

    // // Insert at the beginning of the grid
    // container.insertBefore(movieCard, container.firstChild);

    // // Optional: Reset form
    // // document.getElementById("addMovieForm").reset();


    // // Format
    // const formattedDate = `01 ${new Date().toLocaleString('en-US', { month: 'long' })} ${year}`;
    // const posterURL = poster || "https://via.placeholder.com/270x380?text=No+Image";

    // // Create movie card element
    // const movieCard = document.createElement("div");
    // movieCard.className = "flex flex-col w-[270px] h-[460px] mb-[20px]";
    // movieCard.innerHTML = `
    //   <img
    //     src="${posterURL}"
    //     alt="${title}"
    //     class="w-full h-[380px] object-cover rounded-xl shadow-xl"
    //   />
    //   <div class="flex flex-col justify-start items-start h-[80px] px-2 mt-2">
    //     <h1 class="text-yellow-500 text-xl font-mulish-medium">${formattedDate}</h1>
    //     <h1 class="text-white text-xl pt-1 font-mulish-medium break-words leading-snug">${title}</h1>
    //   </div>
    // `;

    // // Insert at the beginning of the grid
    // container.insertBefore(movieCard, container.firstChild);

    // // Optional: Reset form
    // // document.getElementById("addMovieForm").reset();

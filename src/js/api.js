"use strict";
const api_key = "c57ca76ab731221b15c53979859d9125";
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=en-US&page=1`;
const imgsrc = "https://image.tmdb.org/t/p/w300";
const cardcontainer = document.getElementById("postercontainer");

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    const movies = data.results;
    console.log(movies);
    // Use map and return HTML string, then join it
    cardcontainer.innerHTML = movies
      .map((movie) => {
        function formatReleaseDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0'); // "01"
  const month = date.toLocaleString('en-US', { month: 'long' }); // "May"
  const year = date.getFullYear(); // "2025"
  return `${day} ${month} ${year}`;
}

const rawDate = movie.release_date; // Example: "2025-05-01"
const formattedDate = formatReleaseDate(rawDate);



        
        return `
        <div class="flex flex-col w-[270px] h-[460px] rounded-xl overflow-hidden">
  <img
    src="${imgsrc}${movie.poster_path}"
    alt="${movie.title}"
    class="w-full h-[380px] object-cover"
  />
  <div class="flex flex-col justify-center items-baseline h-[80px]  text-center">
    <h1 class="text-yellow-500 text-xl font-medium line-clamp-2">
      ${formattedDate}
    </h1>
    <h1 class="text-white text-xl font-medium line-clamp-2 pt-[5px]">
      ${movie.title}
    </h1>
  </div>
</div>

        `;
      })
      .join("");
  })
  .catch((err) => console.error(err));

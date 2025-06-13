"use strict";

// Get elements from the DOM
document.addEventListener("DOMContentLoaded", () => {
const addBtn = document.getElementById("add_to_watchlater");
const movieList = document.getElementById("watchlaterList");
addBtn.addEventListener("click", () => {
    // Create a new <li> element
    const li = document.createElement("li");
    li.className =
      "bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition duration-300 flex justify-between items-center px-[50px]";

    // Add movie info into the <li>
    li.innerHTML = `
      <div class="flex items-center">
        <img class="max-w-[100px]" src="https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRpBlLNm-0lrsQ-I4CvYRujxHATlIBQb5vYIiYNpyxPCfvkOiQXAqFuAl8ifMc6wK8TBd9W9i94M3v2E1alA074R9sYLr2v80q1oyPU80QgUnurlpWj-y6DJzb0RqeVvLvMTdDZQzZ-uvVt" alt="Ronaldo Poster" />
        <div class="pl-[20px] flex flex-col gap-1">
          <p class="text-3xl font-semibold">Ronaldo</p>
          <p class="text-xl text-gray-300">HH</p>
          <p class="text-xl text-gray-300">fsaf</p>
          <p class="text-xl text-gray-300">10 / 10</p>
        </div>
      </div>
      <button class="bg-green-500 text-black p-[10px] h-[50px] font-semibold rounded-[10px]">Watch now</button>
    `;

    // Add to the list
    movieList.appendChild(li);
  });
});
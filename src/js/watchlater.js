"use strict";
const movieList = document.getElementById("movieList");
const watchlist = document.getElementById("watchlist");
const watchlistButton = document.getElementById("watchLaterBtn");
const welcomepage = document.getElementById("welcome");
const Addmodal = document.getElementById("addMovieModal");
const emptystate = document.getElementById("empty");

// Create delete confirmation modal
function createDeleteModal() {
  const modal = document.createElement('div');
  modal.id = 'deleteModal';
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 hidden';
  modal.innerHTML = `
    <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-95 opacity-0" id="deleteModalContent">
      <div class="flex items-center gap-3 mb-4">
        <div class="bg-red-500/20 p-2 rounded-full">
          <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-white">Remove Movie</h3>
      </div>
      
      <p class="text-gray-300 mb-6" id="deleteModalText">
        Are you sure you want to remove this movie from your watch later list?
      </p>
      
      <div class="flex gap-3 justify-end">
        <button id="cancelDelete" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium">
          Cancel
        </button>
        <button id="confirmDelete" class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium">
          Remove
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  return modal;
}

// Initialize delete modal
let deleteModal = null;
let currentMovieToDelete = null;
let currentListItemToDelete = null;

function showDeleteModal(movieTitle, movieID, listItem) {
  if (!deleteModal) {
    deleteModal = createDeleteModal();
  }
  
  currentMovieToDelete = movieID;
  currentListItemToDelete = listItem;
  
  // Update modal text with movie title
  const modalText = deleteModal.querySelector('#deleteModalText');
  modalText.textContent = `Are you sure you want to remove "${movieTitle}" from your watchlist?`;
  
  // Show modal with animation
  deleteModal.classList.remove('hidden');
  setTimeout(() => {
    const content = deleteModal.querySelector('#deleteModalContent');
    content.style.transform = 'scale(1)';
    content.style.opacity = '1';
  }, 10);
  
  // Add event listeners
  const cancelBtn = deleteModal.querySelector('#cancelDelete');
  const confirmBtn = deleteModal.querySelector('#confirmDelete');
  
  // Remove existing listeners
  cancelBtn.replaceWith(cancelBtn.cloneNode(true));
  confirmBtn.replaceWith(confirmBtn.cloneNode(true));
  
  // Add new listeners
  deleteModal.querySelector('#cancelDelete').addEventListener('click', hideDeleteModal);
  deleteModal.querySelector('#confirmDelete').addEventListener('click', () => {
    handleDeleteMovie(currentMovieToDelete, currentListItemToDelete);
    hideDeleteModal();
  });
  
  // Close on backdrop click
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      hideDeleteModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', handleEscapeKey);
}

function hideDeleteModal() {
  if (!deleteModal) return;
  
  const content = deleteModal.querySelector('#deleteModalContent');
  content.style.transform = 'scale(0.95)';
  content.style.opacity = '0';
  
  setTimeout(() => {
    deleteModal.classList.add('hidden');
    currentMovieToDelete = null;
    currentListItemToDelete = null;
  }, 300);
  
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    hideDeleteModal();
  }
}

watchlistButton.addEventListener("click", () => {
  watchlist.classList.remove("hidden");
  Addmodal.classList.add("hidden");
  welcomepage.classList.add("hidden");
  emptystate.classList.add("hidden");
});

// Cookie helper functions (add these if you don't have them)
function setCookieArray(name, array) {
  const value = JSON.stringify(array);
  document.cookie = `${name}=${value}; path=/; max-age=31536000`; // 1 year expiry
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Function to remove movie from cookie
function removeMovieFromWatchlist(movieID) {
  console.log('Removing movie ID:', movieID); // Debug log
  let watchLaterList = getCookieArray("watch_later");
  console.log('Current watchlist:', watchLaterList); // Debug log
  
  // Convert movieID to string to ensure proper comparison
  const movieIdStr = String(movieID);
  watchLaterList = watchLaterList.filter(id => String(id) !== movieIdStr);
  
  console.log('Updated watchlist:', watchLaterList); // Debug log
  
  // Update the cookie with the new list
  setCookieArray("watch_later", watchLaterList);
}

// Function to handle delete button click
function handleDeleteMovie(movieID, listItem) {
  console.log('Delete button clicked for movie:', movieID); // Debug log
  
  // Remove from cookie
  removeMovieFromWatchlist(movieID);
  
  // Remove from DOM with animation
  listItem.style.transition = "all 0.3s ease-out";
  listItem.style.transform = "translateX(-100%)";
  listItem.style.opacity = "0";
  
  setTimeout(() => {
    listItem.remove();
    
    // Check if list is empty and show empty state if needed
    if (movieList.children.length === 0) {
      emptystate.classList.remove("hidden");
    }
  }, 300);
}

window.onload = function () {
  let list_to_show = getCookieArray("watch_later");
  
  // Show empty state if no movies
  if (list_to_show.length === 0) {
    emptystate.classList.remove("hidden");
    return;
  }
  
  list_to_show.forEach(async (movieID) => {
    const url = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${api_key}`;
    const initial = await fetch(url);
    const data = await initial.json();
    const li = document.createElement("li");
    li.className =
      "bg-white/10 border border-white/20 rounded-lg p-4 hover:bg-white/20 transition-all duration-300 flex justify-between items-center px-[50px] relative group";
    
    li.innerHTML = `
      <div class="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 gap-6 text-center sm:text-left">
        <img class="h-[150px] max-w-full rounded-lg" src="https://image.tmdb.org/t/p/w300${
          data.poster_path
        }" alt="${data.title}" />
        <div class="flex flex-col gap-1">
          <p class="text-xl sm:text-2xl md:text-3xl font-semibold">${
            data.title
          }</p>
          <p class="text-sm sm:text-base md:text-lg text-gray-300">${
            data.release_date || "Unknown"
          }</p>
          <p class="text-sm sm:text-base md:text-lg text-gray-300">${(
            data.original_language || ""
          ).toUpperCase()}</p>
          <p class="text-sm sm:text-base md:text-lg text-gray-300">${
            data.vote_average || "N/A"
          } / 10</p>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Delete Button -->
        <button class="delete-btn bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0" 
                data-movie-id="${movieID}" 
                title="Remove from watchlist">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
        
        <!-- Watch Now Button -->
        <button class="bg-green-500 text-black px-4 py-2 sm:px-5 sm:py-3 text-sm sm:text-base md:text-lg font-semibold rounded-lg transition duration-300 hover:bg-green-600">
          Watch now
        </button>
      </div>
    `;
    
    // Add delete functionality
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent any parent click events
      e.preventDefault(); // Prevent default action
      
      console.log('Delete button clicked!'); // Debug log
      
      // Show custom modal instead of browser confirm
      showDeleteModal(data.title, movieID, li);
    });
    
    movieList.appendChild(li);
  });
};


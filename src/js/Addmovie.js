
  document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("addMovieCard");
    const modal = document.getElementById("addMovieModal");
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");

    // Open modal on button click
    openBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });

    // Close modal on X or Cancel
    [closeBtn, cancelBtn].forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.classList.add("hidden");
      });
    });
  });

//   =============================================================================================
  




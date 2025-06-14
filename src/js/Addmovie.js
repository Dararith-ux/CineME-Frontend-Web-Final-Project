
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

//   =============================================================================================
  




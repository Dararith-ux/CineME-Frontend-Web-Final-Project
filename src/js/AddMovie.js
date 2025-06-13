document.addEventListener("DOMContentLoaded", () => {
    const addMovieCard = document.getElementById("addMovieCard");
    const modal = document.getElementById("addMovieModal");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
  
    // Open modal
    addMovieCard.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  
    // Close modal
    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  
    cancelBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  });

//   ======================================================Add new movie float ===============================================================
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("addMovieModal");
    const header = document.getElementById("modalHeader");
    const openBtn = document.getElementById("addMovieCard");
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
  
    // Show modal
    openBtn?.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  
    // Hide modal
    closeBtn?.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
    cancelBtn?.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  
    // Drag logic
    let isDragging = false;
    let offsetX, offsetY;
  
    header.addEventListener("mousedown", (e) => {
      isDragging = true;
      const rect = modal.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      modal.style.cursor = "move";
    });
  
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      modal.style.left = `${e.clientX - offsetX}px`;
      modal.style.top = `${e.clientY - offsetY}px`;
      modal.style.position = "absolute";
    });
  
    document.addEventListener("mouseup", () => {
      isDragging = false;
      modal.style.cursor = "default";
    });
  });
  
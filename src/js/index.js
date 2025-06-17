// Theme toggle functionality
let isDarkMode = false;
const body = document.getElementById("body");
const themeToggle = document.getElementById("themeToggle");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const add_to_watch_letter_btn = document.getElementById("add_to_watch_later")
// Set active nav item
document.addEventListener("DOMContentLoaded", function () {
  const navItems = document.querySelectorAll(".nav-item");
  navItems[0].classList.add("active"); // Set Home as active by default
});

// Theme toggle
themeToggle.addEventListener("click", function () {
  isDarkMode = !isDarkMode;

  if (isDarkMode) {
    body.className = "gradient-bg-night";
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  } else {
    body.className = "gradient-bg-day";
    moonIcon.classList.add("hidden");
    sunIcon.classList.remove("hidden");
  }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener("click", function () {
  mobileMenu.classList.toggle("hidden");
});

// Navigation click handlers
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active class from all nav items
    document.querySelectorAll(".nav-item").forEach((nav) => {
      nav.classList.remove("active");
    });

    // Add active class to clicked item
    this.classList.add("active");
  });
});

// Search functionality
document
  .querySelector(".search-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const searchTerm = this.value.trim();
      if (searchTerm) {
        console.log("Searching for:", searchTerm);
        // Add your search logic here
      }
    }
  });

// Search button click
document
  .querySelector(".search-container button")
  .addEventListener("click", function () {
    const searchInput = document.querySelector(".search-input");
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      console.log("Searching for:", searchTerm);
      // Add your search logic here
    } else {
      searchInput.focus();
    }
  });

// Smooth animations on scroll
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  if (window.scrollY > 10) {
    header.style.backdropFilter = "blur(10px)";
    header.style.backgroundColor = isDarkMode
      ? "rgba(0,0,0,0.8)"
      : "rgba(74,28,64,0.8)";
  } else {
    header.style.backdropFilter = "none";
    header.style.backgroundColor = "transparent";
  }
});
// =================================================BANNNER SECTION============================================================================
let currentSlide = 0;
const slides = document.querySelectorAll(".banner-slide");
const totalSlides = slides.length;
const bannerContainer = document.getElementById("bannerContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showSlide(index) {
  slides.forEach((slide, i) => {
    if (i === index) {
      slide.style.opacity = "1";
      slide.style.transform = "scale(1)";
    } else {
      slide.style.opacity = "0";
      slide.style.transform = "scale(1.05)";
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Click events
bannerContainer.addEventListener("click", (e) => {
  if (e.target !== prevBtn && e.target !== nextBtn) {
    nextSlide();
  }
});

prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  prevSlide();
});

nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  nextSlide();
});

// Auto-advance every 5 seconds
setInterval(nextSlide, 3000);

// Initialize
showSlide(0);

// Add keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    prevSlide();
  } else if (e.key === "ArrowRight") {
    nextSlide();
  }
});
//============================Footer=========================== Add hover effects and==================================
document.addEventListener("DOMContentLoaded", function () {
  // Social media icons hover effect
  const socialIcons = document.querySelectorAll('footer a[href="#"]');

  socialIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.1)";
      this.style.transition = "transform 0.2s ease";
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
});

// ==============================Footer================================================
// ABA Modal functions with unique names to avoid conflicts
function openABAModal(event) {
  event.preventDefault(); // Prevent default link behavior
  const modal = document.getElementById("abaModal");
  const modalContent = modal.querySelector(".modal-content");

  // Show modal
  modal.classList.remove("opacity-0", "invisible");
  modal.classList.add("opacity-100", "visible");

  // Scale up modal content
  setTimeout(() => {
    modalContent.classList.remove("scale-90");
    modalContent.classList.add("scale-100");
  }, 10);

  // Prevent body scrolling
  document.body.style.overflow = "hidden";
}

function closeABAModal() {
  const modal = document.getElementById("abaModal");
  const modalContent = modal.querySelector(".modal-content");

  // Scale down modal content
  modalContent.classList.remove("scale-100");
  modalContent.classList.add("scale-90");

  // Hide modal after animation
  setTimeout(() => {
    modal.classList.remove("opacity-100", "visible");
    modal.classList.add("opacity-0", "invisible");
  }, 200);

  // Restore body scrolling
  document.body.style.overflow = "auto";
}

// Close modal when clicking outside
document.getElementById("abaModal").addEventListener("click", function (event) {
  if (event.target === this) {
    closeABAModal();
  }
});

// Close modal with Escape key (only if ABA modal is open)
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const modal = document.getElementById("abaModal");
    if (modal.classList.contains("visible")) {
      closeABAModal();
    }
  }
});

// ADD THE WATCH LATER, LET SEE HOW IT WORK BECAUSE I HAVE NO IDEA.




window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (path.includes(href)) {
      // Set text color if needed
      link.classList.add("text-white");

      // Expand underline span
      const underline = link.querySelector(".underline-span");
      if (underline) {
        underline.classList.remove("w-0");
        underline.classList.add("w-full");
      }
    }
  });
});


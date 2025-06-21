"use strict"
// Sidebar Toggle (Mobile)
      const hamburgerBtn = document.getElementById("hamburgerBtn");
      const sidebar = document.getElementById("sidebar");
      const sidebarOverlay = document.getElementById("sidebarOverlay");
      const sidebarToggle = document.getElementById("sidebarToggle");

      function toggleSidebar() {
        const isHidden = sidebar.classList.contains("-translate-x-full");

        if (isHidden) {
          // Show sidebar
          sidebar.classList.remove("-translate-x-full");
          sidebar.classList.add("translate-x-0");
          sidebarOverlay.classList.remove("opacity-0", "pointer-events-none");
          sidebarOverlay.classList.add("opacity-100");
          // Prevent body scroll when sidebar is open on mobile
          document.body.style.overflow = "hidden";
        } else {
          // Hide sidebar
          sidebar.classList.add("-translate-x-full");
          sidebar.classList.remove("translate-x-0");
          sidebarOverlay.classList.add("opacity-0", "pointer-events-none");
          sidebarOverlay.classList.remove("opacity-100");
          // Restore body scroll
          document.body.style.overflow = "";
        }
      }

      function closeSidebar() {
        sidebar.classList.add("-translate-x-full");
        sidebar.classList.remove("translate-x-0");
        sidebarOverlay.classList.add("opacity-0", "pointer-events-none");
        sidebarOverlay.classList.remove("opacity-100");
        document.body.style.overflow = "";
      }

      function openSidebar() {
        sidebar.classList.remove("-translate-x-full");
        sidebar.classList.add("translate-x-0");
        sidebarOverlay.classList.remove("opacity-0", "pointer-events-none");
        sidebarOverlay.classList.add("opacity-100");
      }

      // Event listeners
      hamburgerBtn?.addEventListener("click", toggleSidebar);
      sidebarToggle?.addEventListener("click", toggleSidebar);
      sidebarOverlay?.addEventListener("click", closeSidebar);

      // Close sidebar when clicking on sidebar items (mobile)
      const sidebarItems = sidebar?.querySelectorAll('[id$="Btn"], button');
      sidebarItems?.forEach((item) => {
        item.addEventListener("click", () => {
          if (window.innerWidth < 1024) {
            setTimeout(closeSidebar, 100); // Small delay for better UX
          }
        });
      });

      // Handle window resize for sidebar
      window.addEventListener("resize", () => {
        if (window.innerWidth >= 1024) {
          // Desktop: ensure sidebar is visible and no overlay

          sidebar.classList.remove("-translate-x-full");
          sidebar.classList.add("translate-x-0");
          sidebarOverlay.classList.add("opacity-0", "pointer-events-none");
          sidebarOverlay.classList.remove("opacity-100");
          document.body.style.overflow = "";
        } else {
          // Mobile: ensure sidebar starts hidden
          sidebar.classList.add("-translate-x-full");
          sidebar.classList.remove("translate-x-0");
          sidebarOverlay.classList.add("opacity-0", "pointer-events-none");
          sidebarOverlay.classList.remove("opacity-100");
        }
      });
      function handleResize() {
        const searchBar = document.getElementById("searchBar");
        if (!searchBar) return;

        if (window.innerWidth < 1024) {
          searchBar.classList.add("hidden");
        } else {
          searchBar.classList.remove("hidden");
        }
      }

      // Run on page load
      window.addEventListener("DOMContentLoaded", handleResize);

      // Run on screen resize
      window.addEventListener("resize", handleResize);
      // Initialize sidebar state on page load
      document.addEventListener("DOMContentLoaded", () => {
        if (window.innerWidth >= 1024) {
          openSidebar();
          sidebarOverlay.classList.add("opacity-0", "pointer-events-none");
        } else {
          closeSidebar();
        }
      });
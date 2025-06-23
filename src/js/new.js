document.addEventListener('DOMContentLoaded', function() {
    const pageButtons = document.querySelectorAll('.page-button');
    const tabButtons = document.querySelectorAll('.tab-button');
    const editBtn = document.getElementById('editBtn');
    const currentPageSpan = document.getElementById('currentPage');
    const pageContents = document.querySelectorAll('.page-content');
    
   
   // Handle page button clicks
pageButtons.forEach(button => {
    button.addEventListener('click', function () {
      const pageNumber = this.getAttribute('data-page');
  
      // Clear active class from all buttons
      pageButtons.forEach(btn => btn.classList.remove('active'));
  
      // Set active on the clicked button
      this.classList.add('active');
  
      // Update "Currently viewing" text
      if (currentPageSpan) {
        currentPageSpan.textContent = `Page ${pageNumber}`;
      }
  
      // Optionally, trigger page content logic here (if needed)
    });
  });
  
    
    // Handle tab button clicks
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show/hide edit button based on active tab
            if (editBtn) {
                if (this.id === 'addedMovie') {
                    editBtn.classList.remove('hidden');
                } else {
                    editBtn.classList.add('hidden');
                }
            }
            
            // Reset to page 1 when switching tabs
            pageButtons.forEach(btn => btn.classList.remove('active'));
            if (pageButtons[0]) {
                pageButtons[0].classList.add('active');
            }
            
            // Show page 1 content
            pageContents.forEach(content => content.classList.remove('active'));
            const firstPageContent = document.querySelector('.page-content[data-page="1"]');
            if (firstPageContent) {
                firstPageContent.classList.add('active');
            }
            
            if (currentPageSpan) {
                currentPageSpan.textContent = 'Page 1';
            }
            
            console.log(`Switched to tab: ${this.textContent.trim()}`);
        });
    });
});
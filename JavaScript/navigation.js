// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default navigation
            
            const href = this.getAttribute('href');
            const currentPath = window.location.pathname;
            const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
            
            // Construct absolute path
            const targetPath = currentDir + '/' + href;
            
            // Navigate to the page
            window.location.href = targetPath;
        });
    });
});
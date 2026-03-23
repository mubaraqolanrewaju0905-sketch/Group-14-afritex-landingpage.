document.addEventListener('DOMContentLoaded', () => {
    // Check if customer is logged in
    if (localStorage.getItem('customerLoggedIn') !== 'true') {
        window.location.href = 'customersignin.html';
        return;
    }

    // Update welcome message with user's name
    const stored = JSON.parse(localStorage.getItem('customerProfile') || '{}');
    const welcomeElement = document.querySelector('.main-content h2');
    if (welcomeElement && stored.fullName) {
        welcomeElement.textContent = `Welcome back ${stored.fullName}!`;
    }

    // Update the date to current date
    const dateElement = document.querySelector('.main-content p');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }

    // Logout functionality
    const logoutButton = document.querySelector('.bottom-links li:last-child button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('customerLoggedIn');
            window.location.href = '../index.html'; // Redirect to home or sign-in
        });
    }

    // Responsiveness: Toggle sidebar on mobile
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Add hamburger menu button to navbar for mobile
    const navbar = document.querySelector('.navbar');
    const hamburger = document.createElement('button');
    hamburger.innerHTML = '☰';
    hamburger.className = 'hamburger';
    hamburger.style.display = 'none'; // Hidden by default
    hamburger.style.background = 'none';
    hamburger.style.border = 'none';
    hamburger.style.fontSize = '24px';
    hamburger.style.color = 'white';
    hamburger.style.cursor = 'pointer';
    navbar.appendChild(hamburger);

    // Show hamburger on mobile
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            sidebar.style.display = 'none'; // Hide sidebar initially on mobile
        } else {
            hamburger.style.display = 'none';
            sidebar.style.display = 'flex'; // Show sidebar on desktop
        }
    }

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Toggle sidebar on hamburger click
    hamburger.addEventListener('click', () => {
        if (sidebar.style.display === 'none' || sidebar.style.display === '') {
            sidebar.style.display = 'flex';
        } else {
            sidebar.style.display = 'none';
        }
    });

    // Optional: Handle other buttons (e.g., overview, orders, etc.)
    // For now, just add click handlers that could show alerts or navigate
    const overviewBtn = document.querySelector('.main-links li:first-child button');
    if (overviewBtn) {
        overviewBtn.addEventListener('click', () => {
            alert('Overview clicked');
        });
    }

    // Similarly for other buttons...
});

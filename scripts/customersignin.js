document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    // if (localStorage.getItem('customerLoggedIn') === 'true') {
    //     window.location.href = 'customerdashboard.html';
    //     return;
    // }

    const form = document.getElementById('signinForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(el => {
        el.addEventListener('click', () => {
            const target = document.getElementById(el.dataset.target);
            if (target) {
                target.type = target.type === 'password' ? 'text' : 'password';
                el.textContent = target.type === 'password' ? '👁️' : '🙈';
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        const stored = JSON.parse(localStorage.getItem('customerProfile') || '{}');
        if (stored.email && stored.email.toLowerCase() === email.toLowerCase() && stored.password === password) {
            localStorage.setItem('customerLoggedIn', 'true');
            alert('Sign in successful!');
            // Redirect to customer dashboard
            window.location.href = 'customerdashboard.html';
        } else {
            alert('Invalid email or password. Please check your credentials or sign up first.');
        }
    });
});
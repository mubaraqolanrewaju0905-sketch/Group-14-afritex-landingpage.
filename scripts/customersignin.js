document.addEventListener('DOMContentLoaded', () => {
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
        if (stored.email && stored.email.toLowerCase() === email.toLowerCase()) {
            localStorage.setItem('customerLoggedIn', 'true');
            alert('Sign in successful!');
            // In a real app, redirect to customer dashboard or homepage
        } else {
            alert('No customer account found with that email. Please sign up first.');
        }
    });
});
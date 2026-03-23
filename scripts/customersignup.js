document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('customerForm');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');

    // Social Login Handlers
    document.getElementById('googleBtn').addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Enter your email to continue with Google:');
        if (email) {
            alert(`Redirecting to Google login for ${email}...\n\nIn a real application, this would connect to Google OAuth.`);
            console.log('Google login attempt with email:', email);
        }
    });

    document.getElementById('appleBtn').addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Enter your email to continue with Apple:');
        if (email) {
            alert(`Redirecting to Apple login for ${email}...\n\nIn a real application, this would connect to Apple OAuth.`);
            console.log('Apple login attempt with email:', email);
        }
    });

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

        const pass = passwordInput.value;
        const confirmPass = confirmInput.value;

        // Validation: password complexity
        const complexityRegex = /^(?=.{8,})(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
        if (!complexityRegex.test(pass)) {
            alert("Password must be at least 8 characters and include a capital letter, a number, and a special character.");
            return;
        }

        // Validation: passwords match
        if (pass !== confirmPass) {
            alert("Passwords do not match. Please check again!");
            return;
        }

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('countryCode').value + document.getElementById('phoneNumber').value
        };

        console.log("Customer Account Data:", formData);
        alert(`Thank you, ${formData.fullName}! Your customer account has been created.`);

        // persist the customer profile for sign in
        localStorage.setItem('customerProfile', JSON.stringify(formData));

        form.reset();
    });
});
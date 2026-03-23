document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('designerForm');
    const uploadBox = document.getElementById('uploadBox');
    const idFileInput = document.getElementById('idFile');
    const imagePreview = document.getElementById('imagePreview');
    const uploadIcon = document.getElementById('uploadIcon');
    const removeBtn = document.getElementById('removePhoto');

    // Profile Photo Elements
    const profileUploadBox = document.getElementById('profileUploadBox');
    const profileFileInput = document.getElementById('profileFile');
    const profileImagePreview = document.getElementById('profileImagePreview');
    const profileUploadIcon = document.getElementById('profileUploadIcon');
    const removeProfileBtn = document.getElementById('removeProfilePhoto');

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

    // 1. Handle ID Upload Box click (Triggers file picker)
    uploadBox.addEventListener('click', (e) => {
        // Prevent clicking the 'X' from opening the file picker
        if (e.target !== removeBtn) {
            idFileInput.click();
        }
    });

    // 2. Handle File Selection & Preview
    idFileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadIcon.style.display = 'none';
                removeBtn.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // 3. Handle Remove Photo
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops the click from opening the file dialog
        idFileInput.value = ""; // Clear file data
        imagePreview.src = "";
        imagePreview.style.display = 'none';
        uploadIcon.style.display = 'block';
        removeBtn.style.display = 'none';
    });

    // Profile Photo Upload Handlers
    // 1. Handle Profile Upload Box click (Triggers file picker)
    profileUploadBox.addEventListener('click', (e) => {
        // Prevent clicking the 'X' from opening the file picker
        if (e.target !== removeProfileBtn) {
            profileFileInput.click();
        }
    });

    // 2. Handle Profile File Selection & Preview
    profileFileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImagePreview.src = e.target.result;
                profileImagePreview.style.display = 'block';
                profileUploadIcon.style.display = 'none';
                removeProfileBtn.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    // 3. Handle Remove Profile Photo
    removeProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stops the click from opening the file dialog
        profileFileInput.value = ""; // Clear file data
        profileImagePreview.src = "";
        profileImagePreview.style.display = 'none';
        profileUploadIcon.style.display = 'block';
        removeProfileBtn.style.display = 'none';
    });

    // 4. Handle Final Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const pass = document.getElementById('password').value;
        const confirmPass = document.getElementById('confirmPassword').value;

        // Validation: password complexity
        // Must be at least 8 characters long and contain at least one uppercase letter, one digit and one special character
        const complexityRegex = /^(?=.{8,})(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
        if (!complexityRegex.test(pass)) {
            alert("Password must be at least 8 characters and include a capital letter, a number, and a special character.");
            return;
        }

        // Validation: Passwords match
        if (pass !== confirmPass) {
            alert("Passwords do not match. Please check again!");
            return;
        }

        // Validation: Ensure ID is uploaded
        if (!idFileInput.files[0]) {
            alert("Please upload a valid ID for verification.");
            return;
        }

        // Validation: Ensure Profile Photo is uploaded
        if (!profileFileInput.files[0]) {
            alert("Please upload a profile photo.");
            return;
        }

        // Collect all data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('countryCode').value + document.getElementById('phoneNumber').value,
            portfolio: document.getElementById('portfolioUrl').value,
            idFileName: idFileInput.files[0].name,
            profileFileName: profileFileInput.files[0].name,
            profilePhotoData: profileImagePreview.src // Store the base64 data for dashboard display
        };

        console.log("Designer Account Data:", formData);
        alert(`Thank you, ${formData.fullName}! Your designer application has been submitted.`);
        
        // persist profile locally for dashboard access (simulated backend)
        localStorage.setItem('designerProfile', JSON.stringify(formData));
        
        // Reset form fields and clear the ID preview
        form.reset();
        // manually clear the preview elements since reset() doesn't affect them
        idFileInput.value = "";
        imagePreview.src = "";
        imagePreview.style.display = 'none';
        uploadIcon.style.display = 'block';
        removeBtn.style.display = 'none';
        // Clear profile photo preview
        profileFileInput.value = "";
        profileImagePreview.src = "";
        profileImagePreview.style.display = 'none';
        profileUploadIcon.style.display = 'block';
        removeProfileBtn.style.display = 'none';
    });
});
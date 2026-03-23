document.addEventListener('DOMContentLoaded', () => {

    // Set Current Date dynamically
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('en-GB', dateOptions);
    // load profile and update welcome message if available
    const stored = localStorage.getItem('designerProfile');
    if (stored) {
        try {
            const p = JSON.parse(stored);
            if (p.fullName) {
                document.querySelector('.welcome-header h2').innerText = `Welcome back, ${p.fullName.split(' ')[0]}!`;
            }
            // Load profile photo in header
            if (p.profilePhotoData) {
                const profilePhoto = document.getElementById('profilePhoto');
                const defaultIcon = document.getElementById('defaultProfileIcon');
                profilePhoto.src = p.profilePhotoData;
                profilePhoto.style.display = 'block';
                defaultIcon.style.display = 'none';
            }
        } catch {}    
    }

    // --- PRODUCTS (persisted in localStorage) ---
    let products = [
        { name: "Ankara Bracelet", price: "$32", stock: "12 units", status: "Active", image: "../images/ankara-bracelet.jpg" },
        { name: "Cowrie Necklace", price: "$12", stock: "12 units", status: "Active", image: "../images/cowrie-necklace.jpg" },
        { name: "Beaded Earrings", price: "$11", stock: "12 units", status: "Active", image: "../images/beaded-earrings.jpg" },
        { name: "Ankara Sandals", price: "$24", stock: "12 units", status: "Active", image: "../images/ankara-sandals.jpg" }
    ];

    function saveProducts() {
        try {
            localStorage.setItem('designerProducts', JSON.stringify(products));
        } catch (err) {
            console.warn('Could not save products to localStorage', err);
        }
    }

    function loadProducts() {
        const storedProducts = localStorage.getItem('designerProducts');
        if (storedProducts) {
            try {
                const parsed = JSON.parse(storedProducts);
                if (Array.isArray(parsed)) {
                    products = parsed;
                }
            } catch (err) {
                console.warn('Could not parse stored products', err);
            }
        }
    }

    // Load saved products before rendering
    loadProducts();

    // --- RENDER FUNCTIONS ---
    const productsList = document.getElementById('productsList');
    const totalProductsCount = document.getElementById('totalProductsCount');
    
    let editingIndex = null; // track index for editing

    function renderProducts() {
        productsList.innerHTML = '';
        products.forEach((prod, idx) => {
            const div = document.createElement('div');
            div.className = 'product-item';
            div.dataset.index = idx; // store index for later
            div.innerHTML = `
                <div class="prod-info">
                    <img src="${prod.image || ''}" alt="">
                    <span>${prod.name}</span>
                </div>
                <span>${prod.price}</span>
                <span>${prod.stock}</span>
                <div style="display:flex; justify-content:space-between; align-items:center; gap: 10px;">
                    <span class="status-active">${prod.status}</span>
                    <div style="display:flex; gap: 10px; align-items:center;">
                        <i class="fa-solid fa-pen edit-icon" title="Edit product"></i>
                        <i class="fa-solid fa-trash delete-icon" title="Delete product"></i>
                    </div>
                </div>
            `;
            productsList.appendChild(div);
        });
        
        // Update the stat card total (use actual count from array)
        totalProductsCount.innerText = products.length;

        // persist products after render (ensures image URLs stay saved)
        saveProducts();

        // attach edit handlers
        document.querySelectorAll('.edit-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const item = e.target.closest('.product-item');
                editingIndex = parseInt(item.dataset.index, 10);
                const prod = products[editingIndex];
                // fill form
                document.getElementById('prodName').value = prod.name;
                document.getElementById('prodPrice').value = prod.price.replace(/\$/g, '');
                document.getElementById('prodStock').value = prod.stock.replace(/[^[0-9]]/g, '');
                if (prod.image) {
                    prodImgPreview.src = prod.image;
                    prodImgPreview.style.display = 'block';
                    prodImgIcon.style.display = 'none';
                }
                modal.style.display = 'flex';
            });
        });

        // attach delete handlers
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const item = e.target.closest('.product-item');
                const indexToDelete = parseInt(item.dataset.index, 10);
                const confirmed = confirm('Remove this product?');
                if (!confirmed) return;
                products.splice(indexToDelete, 1);
                renderProducts();
            });
        });
    }

    const ordersList = document.getElementById('ordersList');
    function filterOrders(filterStatus = "All") {
        const orderItems = ordersList.querySelectorAll('.order-item');
        orderItems.forEach(item => {
            const status = item.dataset.status;
            if (filterStatus === "All" || status === filterStatus) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Initial Renders
    renderProducts();
    filterOrders();

    // --- ORDER TAB LOGIC ---
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            filterOrders(e.target.dataset.tab);
        });
    });

    // --- SIDEBAR / MOBILE NAV ---
    const dashboardContainer = document.querySelector('.dashboard-container');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function closeSidebar() {
        dashboardContainer.classList.remove('sidebar-open');
    }

    function openSidebar() {
        dashboardContainer.classList.add('sidebar-open');
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (dashboardContainer.classList.contains('sidebar-open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // close sidebar when navigating (mobile)
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 900) closeSidebar();
        });
    });

    // --- MODAL LOGIC ---
    const modal = document.getElementById('addProductModal');
    const openModalBtn = document.getElementById('addProductBtn');
    const closeBtn = document.querySelector('.close-btn');
    const newProductForm = document.getElementById('newProductForm');
    
    // Image Upload Logic for Modal
    const prodImgBox = document.getElementById('prodImgBox');
    const prodImageInput = document.getElementById('prodImage');
    const prodImgPreview = document.getElementById('prodImgPreview');
    const prodImgIcon = document.getElementById('prodImgIcon');

    prodImgBox.addEventListener('click', () => prodImageInput.click());

    prodImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                prodImgPreview.src = e.target.result;
                prodImgPreview.style.display = 'block';
                prodImgIcon.style.display = 'none';
            }
            reader.readAsDataURL(file);
        }
    });

    // Open Modal
    openModalBtn.addEventListener('click', () => { modal.style.display = 'flex'; });

    // Close Modal via 'X'
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });

    // Close Modal by clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) { modal.style.display = 'none'; }
    });

    // Handle Adding/Updating the Product
    newProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const prodObject = {
            name: document.getElementById('prodName').value,
            price: `$${document.getElementById('prodPrice').value}`,
            stock: `${document.getElementById('prodStock').value} units`,
            status: "Active",
            image: prodImgPreview.src // Capture the image data URL (could be empty)
        };
        
        if (editingIndex !== null) {
            // update existing
            products[editingIndex] = prodObject;
        } else {
            // add new
            products.unshift(prodObject);
        }
        renderProducts();
        
        // reset state
        editingIndex = null;
        newProductForm.reset();
        prodImgPreview.src = "";
        prodImgPreview.style.display = 'none';
        prodImgIcon.style.display = 'block';
        modal.style.display = 'none';
    });

    // --- PROFILE MODAL LOGIC ---
    const profileModal = document.getElementById('profileModal');
    const profileLink = document.getElementById('profileLink');
    const profileClose = document.getElementById('profileClose');
    const profileForm = document.getElementById('profileForm');

    // helper to load profile from storage
    function loadProfile() {
        const stored = localStorage.getItem('designerProfile');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                document.getElementById('profileName').value = data.fullName || '';
                document.getElementById('profileEmail').value = data.email || '';
                document.getElementById('profileCountry').value = data.country || '';
                document.getElementById('profilePhone').value = data.phone || '';
                document.getElementById('profilePortfolio').value = data.portfolio || '';
                // Load profile photo in modal
                if (data.profilePhotoData) {
                    document.getElementById('modalProfilePhoto').src = data.profilePhotoData;
                }
            } catch (err) {
                console.warn('Failed to parse profile data', err);
            }
        }
    }

    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadProfile();
        profileModal.style.display = 'flex';
    });
    profileClose.addEventListener('click', () => { profileModal.style.display = 'none'; });
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.style.display = 'none';
    });

    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const existing = JSON.parse(localStorage.getItem('designerProfile') || '{}');
        const updated = {
            fullName: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            country: document.getElementById('profileCountry').value,
            phone: document.getElementById('profilePhone').value,
            portfolio: document.getElementById('profilePortfolio').value,
            // preserve existing data
            idFileName: existing.idFileName || '',
            profileFileName: existing.profileFileName || '',
            profilePhotoData: existing.profilePhotoData || ''
        };
        localStorage.setItem('designerProfile', JSON.stringify(updated));
        alert('Profile updated successfully.');
        profileModal.style.display = 'none';
    });

    // --- LOGOUT FUNCTIONALITY ---
    const logoutLink = document.querySelector('.logout');
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('designerProfile');
        localStorage.removeItem('designerProducts');
        alert('You have been logged out.');
        window.location.href = 'designersignin.html';
    });
});
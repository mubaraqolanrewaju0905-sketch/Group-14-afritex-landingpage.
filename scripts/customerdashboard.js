document.addEventListener('DOMContentLoaded', () => {
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
/* ═══════════════════════════════════════════════
   AFRITEX — Customer Dashboard JavaScript
   customerdashboard.js
═══════════════════════════════════════════════ */

// ══════════════════════════════════════
// DATA
// ══════════════════════════════════════
const orders = [
  { id: '#AFR1308', product: 'Ankara Maxi Dress',   img: 'Images/Ankara Maxi Dress.jpg',     designer: 'House of Angola',      date: 'Feb 10', status: 'delivered',  price: '$250', total: '$250' },
  { id: '#AFR4810', product: 'Kente Midi Dress',    img: 'Images/Kente Midi Dress.png',       designer: 'Zuri Atelier',          date: 'Feb 14', status: 'shipped',    price: '$100', total: '$100' },
  { id: '#AFR7223', product: 'Beaded Necklace',     img: 'Images/Bead necklace.png',          designer: 'Amina Threads',         date: 'Feb 20', status: 'delivered',  price: '$80',  total: '$80'  },
  { id: '#AFR9901', product: 'Agbada Set',           img: 'Images/Agbada set.png',            designer: 'Lagos Designs',         date: 'Mar 1',  status: 'processing', price: '$300', total: '$300' },
  { id: '#AFR6612', product: 'Travel Necklace',     img: 'Images/Zulu Bead Necklace.png',     designer: 'Sohona Craft',          date: 'Mar 5',  status: 'processing', price: '$55',  total: '$55'  },
  { id: '#AFR3421', product: 'Adire Trouser',       img: 'Images/Adire Trouser.png',          designer: 'Kenny Love',            date: 'Mar 10', status: 'cancelled',  price: '$100', total: '$100' },
];

const savedProducts = [
  { name: 'Batik Kimono',        price: '$55',  oldPrice: null,  img: 'Images/Adire Flow.png',         emoji: '👘' },
  { name: 'Cowrie Necklace',     price: '$35',  oldPrice: '$50', img: 'Images/Bead necklace.png',      emoji: '📿' },
  { name: 'Adire Tote Bag',      price: '$42',  oldPrice: null,  img: 'Images/Beaded Bag.png',         emoji: '👜' },
  { name: 'Beaded Earrings',     price: '$22',  oldPrice: '$30', img: 'Images/Beaded Bangle.png',      emoji: '💎' },
];

let cart = [];
let currentFilter = 'all';

// ══════════════════════════════════════
// INIT
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  setDate();
  animateCounters();
  renderOrders('all');
  renderSavedProducts();
  initSearch();
  closeMenusOnOutsideClick();
});

// ══════════════════════════════════════
// DATE
// ══════════════════════════════════════
function setDate() {
  const el = document.getElementById('todayDate');
  if (!el) return;
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = new Date().toLocaleDateString('en-US', options);
}

// ══════════════════════════════════════
// ANIMATE COUNTERS
// ══════════════════════════════════════
function animateCounters() {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 1200;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  });
}

// ══════════════════════════════════════
// RENDER ORDERS TABLE
// ══════════════════════════════════════
function renderOrders(filter) {
  const tbody = document.getElementById('orderTableBody');
  if (!tbody) return;

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;padding:2rem;color:var(--light);font-size:.82rem;">
          No orders found for this filter.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(order => `
    <tr>
      <td>
        <div class="product-cell">
          <div class="product-thumb-placeholder">${getInitials(order.product)}</div>
          <span class="product-cell-name">${order.product}</span>
        </div>
      </td>
      <td style="color:var(--muted);font-size:.72rem;">${order.id}</td>
      <td style="font-size:.76rem;">${order.designer}</td>
      <td style="color:var(--muted);font-size:.76rem;">${order.date}</td>
      <td><span class="badge badge-${order.status}">${capitalize(order.status)}</span></td>
      <td style="font-weight:600;">${order.price}</td>
      <td style="font-weight:700;">${order.total}</td>
      <td>
        <div class="action-row">
          <button class="btn-sm btn-sm-outline" onclick="showTrackModal('${order.id}', '${order.status}')">Track</button>
          <button class="btn-sm btn-sm-gold" onclick="showToast('Reordering ${order.product}...')">Message</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterOrders(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderOrders(filter);
}

// ══════════════════════════════════════
// RENDER SAVED PRODUCTS
// ══════════════════════════════════════
function renderSavedProducts() {
  const grid = document.getElementById('savedGrid');
  if (!grid) return;

  grid.innerHTML = savedProducts.map((p, i) => `
    <div class="saved-card">
      <div class="saved-card-img-placeholder">${p.emoji}</div>
      <div class="saved-card-body">
        <div class="saved-card-name">${p.name}</div>
        <div class="saved-card-price">
          ${p.price}
          ${p.oldPrice ? `<span class="saved-card-old">${p.oldPrice}</span>` : ''}
        </div>
        <button class="btn-add-cart" onclick="addToCart('${p.name}', '${p.price}', this)">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

// ══════════════════════════════════════
// CART
// ══════════════════════════════════════
function addToCart(name, price, btn) {
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty++; }
  else { cart.push({ name, price, qty: 1 }); }

  updateCartCount();
  showToast(`🛍️ ${name} added to cart`);

  if (btn) {
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.classList.remove('added');
    }, 1800);
  }
}

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

// ══════════════════════════════════════
// TRACK ORDER
// ══════════════════════════════════════
function trackOrder() {
  const input = document.getElementById('trackInput');
  const value = input ? input.value.trim() : '';
  if (!value) { showToast('Please enter an order number'); return; }

  const found = orders.find(o => o.id.toLowerCase() === value.toLowerCase());
  if (found) {
    showTrackModal(found.id, found.status);
  } else {
    showToast(`Order "${value}" not found`);
  }
}

function showTrackModal(orderId, status) {
  const steps = [
    { label: 'Order Placed',     desc: 'Your order has been received',        key: 'processing' },
    { label: 'Processing',       desc: 'Your order is being prepared',         key: 'processing' },
    { label: 'Shipped',          desc: 'Your order is on the way',             key: 'shipped' },
    { label: 'Out for Delivery', desc: 'Your order is out for delivery',       key: 'shipped' },
    { label: 'Delivered',        desc: 'Your order has been delivered',        key: 'delivered' },
  ];

  const statusRank = { processing: 1, shipped: 3, delivered: 5, cancelled: 0 };
  const currentRank = statusRank[status] || 0;

  const stepsHTML = steps.map((step, i) => {
    const rank = i + 1;
    let dotClass = 'pending';
    let icon = '○';
    if (rank < currentRank) { dotClass = 'done'; icon = '✓'; }
    else if (rank === currentRank) { dotClass = 'active'; icon = '●'; }
    return `
      <div class="track-step">
        <div class="step-dot ${dotClass}">${icon}</div>
        <div class="step-info">
          <h4>${step.label}</h4>
          <p>${rank <= currentRank ? step.desc : 'Pending'}</p>
        </div>
      </div>`;
  }).join('');

  document.getElementById('trackSteps').innerHTML = stepsHTML;

  const modal = document.getElementById('trackModal');
  modal.querySelector('h3').textContent = `Tracking: ${orderId}`;
  modal.classList.add('open');
}

function closeTrackModal() {
  document.getElementById('trackModal').classList.remove('open');
}

// ══════════════════════════════════════
// SIDEBAR TOGGLE
// ══════════════════════════════════════
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('dashboardMain');
  sidebar.classList.toggle('open');

  // On desktop — push main content
  if (window.innerWidth > 900) {
    const isCollapsed = sidebar.style.width === '60px';
    if (isCollapsed) {
      sidebar.style.width = '220px';
      sidebar.querySelectorAll('.nav-item span').forEach(s => s.style.display = '');
      main.style.marginLeft = '220px';
    } else {
      sidebar.style.width = '60px';
      sidebar.querySelectorAll('.nav-item span').forEach(s => s.style.display = 'none');
      main.style.marginLeft = '60px';
    }
  }
}

// ══════════════════════════════════════
// ACTIVE NAV ITEM
// ══════════════════════════════════════
function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
}

// ══════════════════════════════════════
// PROFILE MENU TOGGLE
// ══════════════════════════════════════
function toggleProfileMenu() {
  const avatar = document.querySelector('.nav-avatar');
  const menu = document.getElementById('profileMenu');
  avatar.classList.toggle('open');
  menu.classList.toggle('open');
}

function closeMenusOnOutsideClick() {
  document.addEventListener('click', (e) => {
    const avatar = document.querySelector('.nav-avatar');
    if (avatar && !avatar.contains(e.target)) {
      avatar.classList.remove('open');
      document.getElementById('profileMenu')?.classList.remove('open');
    }
  });
}

// ══════════════════════════════════════
// GLOBAL SEARCH
// ══════════════════════════════════════
function initSearch() {
  const input = document.getElementById('globalSearch');
  if (!input) return;
  input.addEventListener('keyup', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) { renderOrders(currentFilter); return; }

    const filtered = orders.filter(o =>
      o.product.toLowerCase().includes(query) ||
      o.designer.toLowerCase().includes(query) ||
      o.id.toLowerCase().includes(query)
    );

    const tbody = document.getElementById('orderTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--light);font-size:.82rem;">No results for "${query}"</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(order => `
      <tr>
        <td><div class="product-cell"><div class="product-thumb-placeholder">${getInitials(order.product)}</div><span class="product-cell-name">${order.product}</span></div></td>
        <td style="color:var(--muted);font-size:.72rem;">${order.id}</td>
        <td style="font-size:.76rem;">${order.designer}</td>
        <td style="color:var(--muted);font-size:.76rem;">${order.date}</td>
        <td><span class="badge badge-${order.status}">${capitalize(order.status)}</span></td>
        <td style="font-weight:600;">${order.price}</td>
        <td style="font-weight:700;">${order.total}</td>
        <td><div class="action-row"><button class="btn-sm btn-sm-outline" onclick="showTrackModal('${order.id}','${order.status}')">Track</button><button class="btn-sm btn-sm-gold" onclick="showToast('Messaging...')">Message</button></div></td>
      </tr>
    `).join('');
  });
}

// ══════════════════════════════════════
// TOAST
// ══════════════════════════════════════
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ══════════════════════════════════════
// HELPERS
// ══════════════════════════════════════
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getInitials(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// TOPBAR SHADOW ON SCROLL
// ══════════════════════════════════════
window.addEventListener('scroll', () => {
  const topbar = document.getElementById('topbar');
  if (topbar) {
    topbar.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,.1)'
      : 'none';
  }
});

// ══════════════════════════════════════
// MOBILE NAV TOGGLE
// ══════════════════════════════════════
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  if (nav) nav.classList.toggle('open');
}

// Close mobile nav when a link is clicked
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => {
      const nav = document.getElementById('mobileNav');
      if (nav) nav.classList.remove('open');
    });
  });
});

// ══════════════════════════════════════
// SCROLL REVEAL ANIMATION
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 70);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

// ══════════════════════════════════════
// SMOOTH SCROLL FOR ANCHOR LINKS
// ══════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ══════════════════════════════════════
// CART BADGE — simple counter
// ══════════════════════════════════════
let cartCount = 0;

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) badge.textContent = cartCount;
}
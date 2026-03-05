// ─── NAVBAR SCROLL SHRINK ───
// Shrinks the navbar padding when user scrolls past 60px
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


// ─── MOBILE MENU OPEN/CLOSE ───
// Opens the full-screen mobile overlay menu
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
}

// Closes the full-screen mobile overlay menu
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// Auto-close mobile menu when any nav link inside it is clicked
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});


// ─── SCROLL REVEAL ANIMATION ───
// Uses IntersectionObserver to watch all elements with class "reveal"
// When they enter the viewport, adds "visible" class to trigger CSS fade-up transition
// Elements are staggered with an 80ms delay between each one
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target); // Stop watching once revealed
    }
  });
}, { threshold: 0.12 }); // Triggers when 12% of element is visible

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ─── COUNTER ANIMATION ───
// Uses IntersectionObserver to watch elements with a "data-target" attribute
// When they scroll into view, animates the number counting up from 0 to the target value
// Runs over ~60 frames at 22ms intervals (approx 1.3 seconds)
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = +el.dataset.target; // Read target number from data-target attribute
    let current = 0;
    const step = target / 60; // Divide target into 60 incremental steps

    const timer = setInterval(() => {
      current = Math.min(current + step, target); // Increment but never exceed target
      el.textContent = Math.floor(current);        // Update displayed number
      if (current >= target) clearInterval(timer); // Stop when target is reached
    }, 22);

    counterObserver.unobserve(el); // Only animate once
  });
}, { threshold: 0.5 }); // Triggers when 50% of element is visible

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));


// ─── SMOOTH HOVER TRANSITION ON CARDS ───
// Ensures hover transitions are applied smoothly on interactive cards
document.querySelectorAll('.feat-card, .designer-card, .how-step').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all .25s ease';
  });
});
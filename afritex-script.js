// ─── NAVBAR SCROLL SHRINK ───
// Shrinks the navbar padding when user scrolls past 60px
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});


// ─── MOBILE MENU OPEN/CLOSE ───
function openMobileMenu() {
  document.getElementById('mobileMenu').classList.add('open');
}

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// Auto-close mobile menu when any nav link inside it is clicked
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', closeMobileMenu);
});


// ─── SCROLL REVEAL ANIMATION ───
// Watches all .reveal elements and fades them in with a staggered delay
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ─── COUNTER ANIMATION ───
// Counts numbers up from 0 to their data-target value when scrolled into view
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const target = +el.dataset.target;
    let current = 0;
    const step = target / 60;

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 22);

    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));


// ─── SMOOTH HOVER TRANSITION ON CARDS ───
document.querySelectorAll('.feat-card, .designer-card, .how-step').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all .25s ease';
  });
});

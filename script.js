console.log('script.js loaded');
function toggleMobileNav() {
      document.getElementById('mobileNav').classList.toggle('open');
    }
    document.querySelectorAll('.mobile-nav a').forEach(a => {
      a.addEventListener('click', () => document.getElementById('mobileNav').classList.remove('open'));
    });
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 70);
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    window.addEventListener('scroll', () => {
      document.getElementById('topbar').style.boxShadow =
        window.scrollY > 10 ? '0 2px 16px rgba(0,0,0,.08)' : 'none';
    });
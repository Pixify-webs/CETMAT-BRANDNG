document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const heroVideo = document.getElementById('heroVideo');

  function handleVideoForDevice() {
    if (!heroVideo) return;
    const mobileBreakpoint = 700;
    if (window.innerWidth <= mobileBreakpoint || isTouch) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
      heroVideo.style.display = 'none';
      return;
    } else {
      heroVideo.style.display = '';
      heroVideo.play().catch(()=>{/* autoplay blocked */});
    }
  }
  handleVideoForDevice();
  window.addEventListener('resize', handleVideoForDevice);

  let lastScroll = window.scrollY;
  function parallaxTick() {
    const st = window.scrollY;
    lastScroll = st;
    if (heroVideo && window.innerWidth > 700) {
      const y = Math.min(0, -st * 0.12);
      heroVideo.style.transform = `translateY(${y}px) scale(1.03)`;
    }
    requestAnimationFrame(parallaxTick);
  }
  requestAnimationFrame(parallaxTick);

  const animated = document.querySelectorAll('[data-animate]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Number(el.getAttribute('data-animate-delay') || 0);
        setTimeout(() => el.classList.add('in'), delay);
        io.unobserve(el);
      }
    });
  }, {threshold: 0.12});
  animated.forEach(el => io.observe(el));

  const lazyImgs = document.querySelectorAll('img.lazy[data-src]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.remove('lazy');
        imgObserver.unobserve(img);
      }
    });
  }, {rootMargin: '200px'});
  lazyImgs.forEach(img => imgObserver.observe(img));

  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!open));
      drawer.style.display = open ? 'none' : 'block';
      drawer.setAttribute('aria-hidden', String(open));
    });
  }

  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('pointerdown', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
      circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
      circle.className = 'ripple-effect';
      this.appendChild(circle);
      setTimeout(()=> circle.remove(), 700);
    });
  });

  document.getElementById('cta-hero')?.addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('cta-desktop')?.addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({behavior:'smooth'});
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.style.display === 'block') {
      drawer.style.display = 'none';
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
});

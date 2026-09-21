/**
 * Dr. Siulik's Dental Care - Premium Agency Interactions Engine
 * Lightweight, 60fps vanilla JS micro-animations & Scroll-Reveal
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // 1. SCROLL-REVEAL OBSERVER WITH STAGGER
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .stagger-container');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // If this is a staggered container, handle custom stagger delays if needed
          if (entry.target.classList.contains('stagger-container')) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
              child.style.transitionDelay = `${(index * 0.12) + 0.05}s`;
            });
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately if reduced motion or no observer
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ==========================================================================
  // 2. COUNTER ANIMATION FOR STATISTICS
  // ==========================================================================
  const counterElements = document.querySelectorAll('[data-counter-target]');

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter-target'));
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    const duration = 1800; // ms
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo function: 1 - Math.pow(2, -10 * progress)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = ease * target;

      let formattedNumber;
      if (decimals > 0) {
        formattedNumber = currentVal.toFixed(decimals);
      } else {
        formattedNumber = Math.floor(currentVal).toLocaleString('en-US');
      }

      el.textContent = `${prefix}${formattedNumber}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        // Guarantee exact final value
        const finalVal = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString('en-US');
        el.textContent = `${prefix}${finalVal}${suffix}`;
      }
    }

    requestAnimationFrame(updateCount);
  }

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    counterElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-counter-target'));
      const suffix = el.getAttribute('data-counter-suffix') || '';
      const prefix = el.getAttribute('data-counter-prefix') || '';
      const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
      const finalVal = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString('en-US');
      el.textContent = `${prefix}${finalVal}${suffix}`;
    });
  }

  // ==========================================================================
  // 3. NAVIGATION BAR ANIMATION PAST HERO
  // ==========================================================================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const handleNavScroll = () => {
      if (window.scrollY > 45) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // initialize state
  }

  // ==========================================================================
  // 4. BUTTON CLICK RIPPLE MICRO-INTERACTIONS
  // ==========================================================================
  const interactiveButtons = document.querySelectorAll('.shimmer-btn, a[href="#appointment"], button[type="submit"]');
  interactiveButtons.forEach(btn => {
    btn.addEventListener('mousedown', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        pointer-events: none;
        animation: btnRipple 0.55s linear;
      `;

      if (window.getComputedStyle(this).position === 'static') {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframes once
  if (!document.getElementById('btn-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'btn-ripple-style';
    style.textContent = `
      @keyframes btnRipple {
        to {
          transform: scale(2.6);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
});

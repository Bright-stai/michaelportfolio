/**
 * MICHAEL BASSEY — PORTFOLIO
 * High-Performance Vanilla JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. MOBILE DRAWER NAVIGATION
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    } else {
      mobileMenu.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  }

  // ==========================================
  // 2. SCROLL SPY (ACTIVE NAV LINK HIGHLIGHT)
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNav() {
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // ==========================================
  // 3. TOAST NOTIFICATION SYSTEM
  // ==========================================
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimer;

  function showToast(message) {
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // ==========================================
  // 4. COPY EMAIL TO CLIPBOARD
  // ==========================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailAddress = 'michaelbassey808@gmail.com';

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailAddress);
        } else {
          const tempInput = document.createElement('textarea');
          tempInput.value = emailAddress;
          tempInput.style.position = 'fixed';
          tempInput.style.left = '-9999px';
          document.body.appendChild(tempInput);
          tempInput.focus();
          tempInput.select();
          document.execCommand('copy');
          tempInput.remove();
        }
        showToast('Copied michaelbassey808@gmail.com to clipboard');
      } catch (err) {
        showToast('Email: michaelbassey808@gmail.com');
      }
    });
  }

  // ==========================================
  // 5. RESUME / CV DOWNLOAD CONFIRMATION
  // ==========================================
  const resumeLinks = document.querySelectorAll('a[download]');
  resumeLinks.forEach(link => {
    link.addEventListener('click', () => {
      showToast("Downloading Michael Bassey's official CV (PDF)...");
    });
  });

  // ==========================================
  // 6. CURRENT YEAR IN FOOTER
  // ==========================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

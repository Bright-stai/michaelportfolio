/**
 * MICHAEL BASSEY - CYBERSECURITY PORTFOLIO
 * Modern Vanilla JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve stored theme or default to system preference or dark
  const storedTheme = localStorage.getItem('mb_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (storedTheme) {
    rootElement.setAttribute('data-theme', storedTheme);
  } else if (!systemPrefersDark) {
    // If system explicitly prefers light, use light, else default to dark
    rootElement.setAttribute('data-theme', 'light');
  } else {
    rootElement.setAttribute('data-theme', 'dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    rootElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('mb_theme', newTheme);

    showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
  });

  // ==========================================
  // 2. STICKY HEADER & SCROLL SPY
  // ==========================================
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.pageYOffset;

    // Header shadow on scroll
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 450) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Scroll spy: highlight current active nav link
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top scroll execution
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================
  // 3. MOBILE MENU TOGGLE
  // ==========================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

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

  mobileToggle.addEventListener('click', toggleMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && !header.contains(e.target)) {
      toggleMobileMenu();
    }
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMobileMenu();
    }
  });

  // ==========================================
  // 4. ANIMATED STAT COUNTERS
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function runCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'), 10);
      const suffix = stat.textContent.includes('%') ? '%' : (stat.textContent.includes('+') ? '+' : '');
      const duration = 1800; // 1.8s
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.floor(easeProgress * target);

        stat.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          stat.textContent = target + suffix;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // Trigger counters with IntersectionObserver
  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          runCounters();
        }
      });
    }, { threshold: 0.3 });

    const terminalStats = document.querySelector('.terminal-stats-grid');
    if (terminalStats) {
      statsObserver.observe(terminalStats);
    }
  }

  // ==========================================
  // 5. SKILLS FILTER TABS
  // ==========================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');

      // Update active tab state
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter visible cards
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || filter === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ==========================================
  // 6. PROJECT CASE STUDY MODAL
  // ==========================================
  const projectDetails = {
    blackbox: {
      tag: "Penetration Testing / VAPT",
      title: "Web Application Black Box Security Testing",
      content: `
        <h4>Project Background</h4>
        <p>A client insurance provider requested an adversarial assessment to evaluate the security posture of their customer-facing insurance portal and backend policy handling architecture. The engagement was executed under pure black-box conditions—simulating a real-world unauthenticated external attacker with zero prior knowledge of source code, internal network architecture, or developer documentation.</p>

        <h4>Methodology & Vulnerabilities Discovered</h4>
        <ul>
          <li><strong>Target Reconnaissance & Subdomain Enumeration:</strong> Uncovered undocumented staging endpoints and exposed API routes via ffuf and Amass.</li>
          <li><strong>Authentication & Session Testing:</strong> Identified flaws in session token revocation and cross-session management, allowing potential account takeovers.</li>
          <li><strong>Data Handling & Exposure:</strong> Found sensitive customer policy details returned in redundant JSON API responses before presentation layers filtered them.</li>
          <li><strong>Input Validation & Injection:</strong> Discovered business logic flaws during multi-step claim submissions that automated scanners completely missed.</li>
        </ul>

        <h4>Business Impact & Remediation</h4>
        <p>Engineered a structured vulnerability assessment report with CVSS 3.1 scoring and step-by-step reproduction scripts. Collaborated directly with lead engineers to implement strict token invalidation, sanitization layers, and endpoint authorization checks prior to the system's major production release.</p>
      `
    },
    api: {
      tag: "API Security & Audit",
      title: "API Security Assessment & Vulnerability Audit",
      content: `
        <h4>Project Scope & Challenge</h4>
        <p>Evaluated modern RESTful APIs powering high-volume client services. The objective was to audit the entire attack surface against the OWASP API Security Top 10 vulnerabilities, specifically hunting for authorization bypasses and sensitive data leaks.</p>

        <h4>Key Assessment Vectors</h4>
        <ul>
          <li><strong>Broken Object Level Authorization (BOLA):</strong> Tested parameter manipulation on resource identifiers (e.g. <code>/api/v1/users/{id}/statements</code>) to successfully uncover horizontal privilege escalations.</li>
          <li><strong>Broken Function Level Authorization (BFLA):</strong> Attempted administrative endpoint invocations using standard authenticated user session bearer tokens.</li>
          <li><strong>Mass Assignment & Parameter Tampering:</strong> Analyzed payload handling to identify undocumented write operations on read-only fields.</li>
          <li><strong>Rate Limiting & Abuse Prevention:</strong> Evaluated API gateway throttling and brute-force defenses against authentication endpoints.</li>
        </ul>

        <h4>Results & Engineering Defense</h4>
        <p>Partnered with backend developers to redesign authorization middleware, enforcing contextual object ownership checks and stripping extraneous data fields from API serializers.</p>
      `
    },
    hardening: {
      tag: "Defensive Architecture",
      title: "Security Architecture & System Hardening",
      content: `
        <h4>Context & Objective</h4>
        <p>Designed and deployed an enterprise-grade defense-in-depth security model to eliminate lateral movement pathways and reinforce system resilience across client infrastructure and endpoints.</p>

        <h4>Architectural Enhancements Implemented</h4>
        <ul>
          <li><strong>Network Segmentation & Access Boundaries:</strong> Established isolated VLANs and firewall zones separating sensitive application databases from public-facing DMZs.</li>
          <li><strong>Endpoint Protection (EDR):</strong> Deployed Microsoft Defender for Endpoint with customized behavioral detection rules and attack surface reduction (ASR) policies.</li>
          <li><strong>System Hardening Benchmarks:</strong> Applied CIS Benchmarks across Linux and Windows servers, restricting unnecessary daemon processes, weak ciphers, and unneeded network services.</li>
          <li><strong>Role-Based Access Control (RBAC):</strong> Standardized least-privilege role hierarchies across administrative control portals.</li>
        </ul>

        <h4>Impact Achieved</h4>
        <p>Successfully reduced the overall external and internal attack surface by 40%, verified via subsequent penetration testing and compliance audit reviews.</p>
      `
    },
    awareness: {
      tag: "Human Factor & Training",
      title: "Security Awareness & Phishing Simulation Program",
      content: `
        <h4>The Human Risk Challenge</h4>
        <p>Technical controls alone cannot prevent social engineering compromises. Developed an interactive educational program designed to train employees to recognize modern spear phishing, credential harvesting, and baiting techniques.</p>

        <h4>Program Execution</h4>
        <ul>
          <li><strong>Custom Phishing Simulations:</strong> Designed realistic multi-vector phishing simulations replicating contemporary urgent lures, credential portals, and malicious attachments.</li>
          <li><strong>Metric-Driven Analytics:</strong> Monitored click rates, credential submission rates, and instant reporting rates across different organizational departments.</li>
          <li><strong>Interactive Workshops:</strong> Led educational workshops teaching safe browsing hygiene, multi-factor authentication (MFA) best practices, and standard incident reporting protocols.</li>
          <li><strong>Security Culture Transformation:</strong> Shifted culture from punitive fear to an active "human sensor" reporting mechanism.</li>
        </ul>

        <h4>Measurable Outcome</h4>
        <p>Significantly lowered click-through rates on simulated attacks and increased proactive employee threat reporting by over 70% within 90 days.</p>
      `
    },
    bounty: {
      tag: "Crowdsourced Security",
      title: "Bug Bounty Program Development & Coordination",
      content: `
        <h4>Overview</h4>
        <p>Spearheaded the design, launch, and ongoing coordination of a crowdsourced bug bounty initiative engaging 50+ ethical hackers and independent security researchers to uncover zero-day and edge-case flaws.</p>

        <h4>Program Responsibilities</h4>
        <ul>
          <li><strong>Program Policy & Scope Definition:</strong> Drafted clear Safe Harbor guidelines, defined in-scope vs. out-of-scope assets, and established severity compensation matrices.</li>
          <li><strong>Vulnerability Triage & Validation:</strong> Screened incoming vulnerability submissions, verified proofs-of-concept (PoCs), filtered duplicate or low-severity reports, and assigned accurate CVSS scores.</li>
          <li><strong>Remediation Pipeline Coordination:</strong> Translated valid disclosures into actionable tickets for software engineering teams, monitoring patches from staging to production.</li>
          <li><strong>Researcher Relations:</strong> Maintained transparent, prompt, and constructive communication with the external ethical hacking community.</li>
        </ul>

        <h4>Organizational Impact</h4>
        <p>Uncovered critical business logic and authorization vulnerabilities that passed automated scanners, enabling the organization to remediate high-severity flaws well before malicious actors could discover them.</p>
      `
    }
  };

  const modalBackdrop = document.getElementById('project-modal');
  const modalTag = document.getElementById('modal-project-type');
  const modalTitle = document.getElementById('modal-project-title');
  const modalContent = document.getElementById('modal-project-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');
  const modalInquireBtn = document.getElementById('modal-inquire-btn');
  const viewDetailBtns = document.querySelectorAll('.view-details-btn');

  function openModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;
    modalContent.innerHTML = data.content;

    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  viewDetailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      openModal(projectId);
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);
  modalDismissBtn.addEventListener('click', closeModal);

  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // ==========================================
  // 7. COPY EMAIL CLIPBOARD & TOAST SYSTEM
  // ==========================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = "michaelbassey808@gmail.com";
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer;

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailText);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = emailText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        showToast('Email address copied to clipboard!');
      } catch (err) {
        showToast('Direct email: michaelbassey808@gmail.com');
      }
    });
  }

  // ==========================================
  // 8. OFFICIAL CV DOWNLOAD NOTIFICATION HANDLER
  // ==========================================
  const cvDownloadBtns = document.querySelectorAll('.cv-download-btn');
  cvDownloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast("Downloading Michael Bassey's official CV (PDF)...");
    });
  });

  // ==========================================
  // 9. INTERACTIVE CONTACT FORM VALIDATION
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      let isValid = true;

      // Reset error states
      [nameInput, emailInput, messageInput].forEach(input => {
        input.parentElement.classList.remove('has-error');
      });

      // Name validation
      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      // Message validation
      if (!messageInput.value.trim()) {
        messageInput.parentElement.classList.add('has-error');
        isValid = false;
      }

      if (isValid) {
        // Simulated submission animation
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Securing & Transmitting...</span>`;

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
          showToast('Message sent securely! Michael will respond shortly.');
          contactForm.reset();
        }, 1200);
      }
    });

    // Real-time error clearance on input
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('has-error')) {
          input.parentElement.classList.remove('has-error');
        }
      });
    });
  }

  // ==========================================
  // 10. DYNAMIC COPYRIGHT YEAR
  // ==========================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

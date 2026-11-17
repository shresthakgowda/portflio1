/**
 * Shrestha | BIT & ECE Student Portfolio - Interactive JavaScript (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initNavigation();
  initProjectFilter();
  initSpotlightCards();
  initCopyEmail();
  initContactForm();
  initBackToTop();
});

/* ==========================================================================
   1. Dynamic Typewriter Effect in Hero Section
   ========================================================================== */
function initTypewriter() {
  const typewriterEl = document.getElementById('typewriterText');
  if (!typewriterEl) return;

  const phrases = [
    'how software logic controls the physical world.',
    'microcontrollers, sensors & embedded systems.',
    'modern full-stack web applications & clean UI.',
    'digital communication protocols & signal processing.',
    'bridging the gap between bits and circuits.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 65;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 60;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause when finished typing
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   2. Navigation, Scrollspy & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('header');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks = document.querySelectorAll('.desktop-nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll handler: Header shadow + Scrollspy
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header shadow toggle
    if (header) {
      if (scrollPos > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scrollspy for active navigation link
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on clicking links
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileMenu.classList.remove('hidden');
    mobileBtn.classList.add('hamburger-open');
    mobileBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    mobileMenu.classList.add('hidden');
    mobileBtn.classList.remove('hamburger-open');
    mobileBtn.setAttribute('aria-expanded', 'false');
  }
}

/* ==========================================================================
   3. Project Filter Tabs
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const countEl = document.getElementById('projectCount');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-filter');
      let visibleCount = 0;

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.classList.remove('is-hidden');
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
        }
      });

      if (countEl) {
        countEl.textContent = `Showing ${visibleCount} of ${projectCards.length} projects`;
      }
    });
  });
}

/* ==========================================================================
   4. Card Spotlight Hover Effect (Cursor-Tracking Glow)
   ========================================================================== */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. Copy Email to Clipboard with Toast Notification
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailTextEl = document.getElementById('emailText');

  if (!copyBtn || !emailTextEl) return;

  copyBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const emailToCopy = emailTextEl.getAttribute('data-email') || emailTextEl.textContent.trim();

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback for non-HTTPS / older browsers
        const textarea = document.createElement('textarea');
        textarea.value = emailToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Email address copied to clipboard!', 'success');
    } catch (err) {
      showToast('Failed to copy. Please select and copy manually.', 'info');
    }
  });
}

/* ==========================================================================
   6. Contact Form Validation & Simulated Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successPanel = document.getElementById('contactSuccess');
  const resetBtn = document.getElementById('resetFormBtn');
  const messageInput = document.getElementById('formMessage');
  const charCounter = document.getElementById('charCount');

  if (!form) return;

  // Live character counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = len;
      if (len > 500) {
        charCounter.classList.add('text-red-600');
      } else {
        charCounter.classList.remove('text-red-600');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
    const btnSpinner = submitBtn ? submitBtn.querySelector('.spinner') : null;

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showFieldError(nameInput, 'Please enter your name (at least 2 characters).');
      isValid = false;
    } else {
      clearFieldError(nameInput);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showFieldError(emailInput, 'Please provide a valid email address.');
      isValid = false;
    } else {
      clearFieldError(emailInput);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showFieldError(messageInput, 'Message must be at least 10 characters.');
      isValid = false;
    } else {
      clearFieldError(messageInput);
    }

    if (!isValid) return;

    // Simulate async submission
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Sending message...';
    if (btnSpinner) btnSpinner.classList.remove('hidden');

    setTimeout(() => {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message';
      if (btnSpinner) btnSpinner.classList.add('hidden');

      form.classList.add('hidden');
      if (successPanel) successPanel.classList.remove('hidden');

      showToast('Message sent successfully in preview mode!', 'success');
    }, 1100);
  });

  // "Send another message" reset button
  if (resetBtn && successPanel) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      if (charCounter) charCounter.textContent = '0';
      successPanel.classList.add('hidden');
      form.classList.remove('hidden');
    });
  }

  function showFieldError(input, msg) {
    input.classList.add('input-error');
    let err = input.parentElement.querySelector('.input-error-msg');
    if (!err) {
      err = document.createElement('div');
      err.className = 'input-error-msg';
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearFieldError(input) {
    input.classList.remove('input-error');
    const err = input.parentElement.querySelector('.input-error-msg');
    if (err) err.remove();
  }
}

/* ==========================================================================
   7. Back-to-Top Button with Scroll Progress Ring
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  const progressCircle = document.querySelector('.progress-ring__circle');
  if (!btn || !progressCircle) return;

  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    const offset = circumference - scrollPercent * circumference;

    progressCircle.style.strokeDashoffset = offset;

    if (scrollTop > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Global Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info', duration = 3200) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconSvg = type === 'success'
    ? `<svg class="h-4 w-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
    : `<svg class="h-4 w-4 text-sky-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.innerHTML = `
    <div class="flex items-center gap-2">
      ${iconSvg}
      <span class="font-medium">${message}</span>
    </div>
    <button type="button" class="text-slate-400 hover:text-slate-700 transition-colors" aria-label="Close notification">&times;</button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('button');
  const dismiss = () => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => toast.remove());
  };

  closeBtn.addEventListener('click', dismiss);
  setTimeout(dismiss, duration);
}

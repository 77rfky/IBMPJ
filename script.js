/**
 * script.js – KerjaRapi Landing Page
 * Vanilla JS — no external libraries
 *
 * Sections:
 *  1. Hamburger / Mobile Menu
 *  2. Smooth Scroll (nav links & CTA buttons)
 *  3. Scroll Fade-in (IntersectionObserver)
 *  4. Accordion / FAQ
 *  5. Kalkulator Penghematan
 *  6. CTA Form – Email Validation
 */

'use strict';

/* ═══════════════════════════════════════════════════════════
   1. HAMBURGER / MOBILE MENU
═══════════════════════════════════════════════════════════ */
(function initMobileMenu() {
  const btn        = document.getElementById('hamburgerBtn');
  const menu       = document.getElementById('mobileMenu');
  const menuLinks  = menu.querySelectorAll('a');

  if (!btn || !menu) return;

  /** Toggle the mobile menu open/closed */
  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : menu.hidden;
    menu.hidden = !isOpen;
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  btn.addEventListener('click', () => toggleMenu());

  // Close when any link inside the menu is clicked
  menuLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) toggleMenu(false);
  });
})();


/* ═══════════════════════════════════════════════════════════
   2. SMOOTH SCROLL
   (Handles browsers without native scroll-behavior support
    and provides offset for the sticky navbar)
═══════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  const NAVBAR_HEIGHT = 64; // matches --navbar-h in CSS

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // Skip pure "#" links

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });

      // Move focus to the section for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   3. SCROLL FADE-IN (IntersectionObserver)
═══════════════════════════════════════════════════════════ */
(function initFadeIn() {
  // Immediately show elements if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate once only
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════════
   4. ACCORDION / FAQ
═══════════════════════════════════════════════════════════ */
(function initAccordion() {
  const accordion = document.getElementById('accordion');
  if (!accordion) return;

  const triggers = accordion.querySelectorAll('.accordion__trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const panelId    = this.getAttribute('aria-controls');
      const panel      = document.getElementById(panelId);

      if (!panel) return;

      // Close ALL other open items first
      triggers.forEach(otherTrigger => {
        if (otherTrigger !== this) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel   = document.getElementById(otherPanelId);
          if (otherPanel) otherPanel.classList.remove('is-open');
        }
      });

      // Toggle the clicked item
      const newState = !isExpanded;
      this.setAttribute('aria-expanded', newState ? 'true' : 'false');
      panel.classList.toggle('is-open', newState);
    });
  });
})();


/* ═══════════════════════════════════════════════════════════
   5. KALKULATOR PENGHEMATAN
   Formula:
    - Penghematan jam/bulan = jam/minggu × 0.7 × 4.33
      (asumsi KerjaRapi menghemat 70% waktu administrasi)
    - Nilai penghematan/bulan = jam hemat × biaya per jam
═══════════════════════════════════════════════════════════ */
(function initKalkulator() {
  const jamInput    = document.getElementById('jamAdmin');
  const biayaInput  = document.getElementById('biayaJam');
  const resultBox   = document.getElementById('kalkulatorResult');

  if (!jamInput || !biayaInput || !resultBox) return;

  /** Format number to Indonesian Rupiah string */
  function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
      style:    'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  /** Render the result card inside the result box */
  function renderResult(jamPerMinggu, biayaPerJam) {
    const EFISIENSI          = 0.70;  // 70% time saved
    const MINGGU_PER_BULAN   = 4.33;

    const jamHematPerBulan   = Math.round(jamPerMinggu * EFISIENSI * MINGGU_PER_BULAN);
    const nilaiHematPerBulan = jamHematPerBulan * biayaPerJam;
    const nilaiHematPerTahun = nilaiHematPerBulan * 12;
    const jamTotalPerBulan   = Math.round(jamPerMinggu * MINGGU_PER_BULAN);

    resultBox.innerHTML = `
      <div class="result-content">
        <h3>Estimasi Penghematan Anda</h3>
        <div class="result-numbers">
          <div class="result-item">
            <div class="result-item__label">Total jam admin/bulan</div>
            <div class="result-item__value">${jamTotalPerBulan} jam</div>
          </div>
          <div class="result-item result-item--accent">
            <div class="result-item__label">Jam yang bisa dihemat</div>
            <div class="result-item__value">${jamHematPerBulan} jam</div>
          </div>
          <div class="result-item result-item--green" style="grid-column: 1 / -1;">
            <div class="result-item__label">Nilai waktu dihemat/bulan</div>
            <div class="result-item__value">${formatRupiah(nilaiHematPerBulan)}</div>
          </div>
        </div>
        <div class="result-summary">
          <div class="result-summary__label">Estimasi penghematan per tahun</div>
          <div class="result-summary__value">${formatRupiah(nilaiHematPerTahun)}</div>
        </div>
      </div>
    `;
  }

  /** Show placeholder when inputs are cleared or invalid */
  function renderPlaceholder() {
    resultBox.innerHTML = `
      <div class="result-placeholder">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="22" stroke="#CBD5E1" stroke-width="2"/>
          <path d="M24 14v10l6 4" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p>Isi form di samping untuk melihat estimasi penghematan Anda</p>
      </div>
    `;
  }

  /** Recalculate whenever any input changes */
  function onInput() {
    const jam   = parseFloat(jamInput.value);
    const biaya = parseFloat(biayaInput.value);

    if (
      !isNaN(jam) && jam > 0 &&
      !isNaN(biaya) && biaya >= 1000
    ) {
      renderResult(jam, biaya);
    } else {
      renderPlaceholder();
    }
  }

  jamInput.addEventListener('input', onInput);
  biayaInput.addEventListener('input', onInput);
})();


/* ═══════════════════════════════════════════════════════════
   6. CTA FORM – EMAIL VALIDATION
═══════════════════════════════════════════════════════════ */
(function initCtaForm() {
  const form   = document.getElementById('ctaForm');
  const input  = document.getElementById('ctaEmail');
  const msgBox = document.getElementById('ctaFormMsg');

  if (!form || !input || !msgBox) return;

  /** Basic RFC 5322 simplified email regex */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function showMsg(text, type) {
    msgBox.textContent = text;
    msgBox.className   = `cta-form__msg ${type}`;
    msgBox.hidden      = false;
  }

  function hideMsg() {
    msgBox.hidden    = true;
    msgBox.className = 'cta-form__msg';
    msgBox.textContent = '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = input.value.trim();

    // Validation
    if (!email) {
      showMsg('⚠ Mohon masukkan alamat email Anda.', 'error');
      input.focus();
      return;
    }
    if (!EMAIL_RE.test(email)) {
      showMsg('⚠ Format email tidak valid. Contoh: nama@email.com', 'error');
      input.focus();
      return;
    }

    // Simulate async submission (replace with real fetch in production)
    showMsg('⏳ Mendaftarkan email Anda...', '');
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(() => {
      showMsg(
        `✓ Berhasil! Kami mengirimkan tautan aktivasi ke ${email}. Selamat datang di KerjaRapi!`,
        'success'
      );
      input.value = '';
      if (submitBtn) submitBtn.disabled = false;

      // Auto-hide success message after 8 seconds
      setTimeout(hideMsg, 8000);
    }, 1000);
  });

  // Clear error message when user starts typing again
  input.addEventListener('input', () => {
    if (!msgBox.classList.contains('success')) hideMsg();
  });
})();


/* ═══════════════════════════════════════════════════════════
   NAVBAR – Active section highlight (scroll spy)
═══════════════════════════════════════════════════════════ */
(function initScrollSpy() {
  const navLinks = document.querySelectorAll('.navbar__nav a[href^="#"]');
  const sections = [];

  navLinks.forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ link, target });
  });

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const match = sections.find(s => s.target === entry.target);
        if (match) {
          match.link.classList.toggle('active', entry.isIntersecting);
        }
      });
    },
    { rootMargin: `-${64}px 0px -70% 0px` }
  );

  sections.forEach(({ target }) => observer.observe(target));
})();

// ===============================
// LibiBouw Onepager Interactions
// ===============================

const header = document.querySelector('.header');
const navList = document.querySelector('.nav__list');
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section');
const yearEl = document.getElementById('year');

const contactForm = document.getElementById('contact-form');
const newsletterForm = document.getElementById('newsletter-form');

// Helper: smooth scrolling
const smoothScroll = (targetId) => {
  const target = document.querySelector(targetId);
  if (!target) return;
  const headerOffset = header ? header.offsetHeight + 12 : 80;
  const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
};

// Toggle mobile nav
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Smooth scroll on nav click
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    smoothScroll(targetId);
    navList?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Header shadow on scroll
const handleScroll = () => {
  if (!header) return;
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
handleScroll();
window.addEventListener('scroll', handleScroll);

// Active link detection
if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          activeLink?.classList.add('active');
        }
      });
    },
    { threshold: 0.42 }
  );
  sections.forEach((section) => observer.observe(section));
}

// Year in footer
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Form validation helper
const validateEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

const handleFormSubmit = (form, fields, successMessage) => {
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    fields.forEach(({ name, type }) => {
      const input = form.elements[name];
      if (!input) return;

      const errorEl = input.parentElement.querySelector('.form__error');
      if (errorEl) errorEl.textContent = '';

      if (!input.value.trim()) {
        if (errorEl) errorEl.textContent = 'Dit veld is verplicht.';
        valid = false;
        return;
      }

      if (type === 'email' && !validateEmail(input.value)) {
        if (errorEl) errorEl.textContent = 'Vul een geldig e-mailadres in.';
        valid = false;
      }
    });

    if (!valid) return;

    const successEl = form.querySelector('.form__success');
    if (successEl) successEl.textContent = successMessage;

    form.reset();

    // small success fade
    if (successEl) {
      successEl.animate(
        [{ opacity: 0, transform: 'translateY(-4px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 240, easing: 'ease-out' }
      );
    }
  });
};

handleFormSubmit(
  contactForm,
  [
    { name: 'name' },
    { name: 'email', type: 'email' },
    { name: 'message' }
  ],
  'Bedankt! We hebben je bericht ontvangen.'
);

handleFormSubmit(
  newsletterForm,
  [{ name: 'newsletterEmail', type: 'email' }],
  'Bedankt voor je aanmelding! Je ontvangt binnenkort onze eerstvolgende update.'
);

// Close mobile nav on outside click
window.addEventListener('click', (event) => {
  if (!navList || !navToggle) return;
  if (!navList.contains(event.target) && !navToggle.contains(event.target)) {
    navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

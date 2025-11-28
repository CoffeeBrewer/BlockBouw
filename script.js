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
  const headerOffset = header.offsetHeight + 12;
  const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
};

// Toggle mobile nav
navToggle.addEventListener('click', () => {
  navList.classList.toggle('open');
});

// Smooth scroll on nav click
navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href');
    smoothScroll(targetId);
    navList.classList.remove('open');
  });
});

// Header shadow on scroll
const handleScroll = () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

handleScroll();
window.addEventListener('scroll', handleScroll);

// Active link detection
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      }
    });
  },
  {
    threshold: 0.4,
  }
);

sections.forEach((section) => observer.observe(section));

// Year in footer
yearEl.textContent = new Date().getFullYear();

// Form validation helper
const validateEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

const handleFormSubmit = (form, fields, successMessage) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    fields.forEach(({ name, type }) => {
      const input = form.elements[name];
      const errorEl = input.parentElement.querySelector('.form__error');
      errorEl.textContent = '';

      if (!input.value.trim()) {
        errorEl.textContent = 'Dit veld is verplicht.';
        valid = false;
        return;
      }

      if (type === 'email' && !validateEmail(input.value)) {
        errorEl.textContent = 'Vul een geldig e-mailadres in.';
        valid = false;
      }
    });

    if (!valid) return;

    const successEl = form.querySelector('.form__success');
    successEl.textContent = successMessage;
    form.reset();
  });
};

handleFormSubmit(
  contactForm,
  [
    { name: 'name' },
    { name: 'email', type: 'email' },
    { name: 'message' },
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
  if (!navList.contains(event.target) && !navToggle.contains(event.target)) {
    navList.classList.remove('open');
  }
});

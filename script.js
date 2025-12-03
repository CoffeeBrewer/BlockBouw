const header = document.querySelector(".header");
const navList = document.querySelector(".nav__list");
const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelectorAll(".nav__link");
const sections = document.querySelectorAll("section");
const yearEl = document.getElementById("year");

const contactForm = document.getElementById("contact-form");

// smooth scroll
const smoothScroll = (targetId) => {
  const target = document.querySelector(targetId);
  if (!target) return;
  const headerOffset = header ? header.offsetHeight + 12 : 80;
  const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
  window.scrollTo({ top: elementPosition - headerOffset, behavior: "smooth" });
};

// mobile nav toggle
if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// smooth scroll on nav click
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    smoothScroll(link.getAttribute("href"));
    navList?.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// header shadow on scroll
const handleScroll = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 18);
};
handleScroll();
window.addEventListener("scroll", handleScroll);

// active section highlight
if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const activeLink = document.querySelector(`.nav__link[href="#${id}"]`);
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          activeLink?.classList.add("active");
        }
      });
    },
    { threshold: 0.45 }
  );
  sections.forEach((s) => observer.observe(s));
}

// footer year
if (yearEl) yearEl.textContent = new Date().getFullYear();

// contact form validation
const validateEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const fields = ["name", "email", "message"];
    fields.forEach((name) => {
      const input = contactForm.elements[name];
      const errorEl = input.parentElement.querySelector(".form__error");
      if (errorEl) errorEl.textContent = "";

      if (!input.value.trim()) {
        errorEl.textContent = "Dit veld is verplicht.";
        valid = false;
      }

      if (name === "email" && input.value && !validateEmail(input.value)) {
        errorEl.textContent = "Vul een geldig e-mailadres in.";
        valid = false;
      }
    });

    if (!valid) return;

    const successEl = contactForm.querySelector(".form__success");
    if (successEl) successEl.textContent = "Bedankt! We nemen snel contact op.";
    contactForm.reset();
  });
}

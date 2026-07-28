/* ============================================
   BABA K — Site Script
   Mobile menu · Scroll reveal · Skill bars · Contact form
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile menu toggle ---------- */
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu after tapping a link
    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Skill bar fill on scroll ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');

  if (skillBars.length && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const percent = bar.getAttribute('data-percent') || 0;
          const fill = bar.querySelector('.skill-fill');
          if (fill) fill.style.width = `${percent}%`;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    skillBars.forEach((bar) => skillObserver.observe(bar));
  } else {
    skillBars.forEach((bar) => {
      const percent = bar.getAttribute('data-percent') || 0;
      const fill = bar.querySelector('.skill-fill');
      if (fill) fill.style.width = `${percent}%`;
    });
  }

  /* ---------- Contact form handling ---------- */
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      const data = Object.fromEntries(new FormData(contactForm).entries());

      if (!data.name || !data.email || !data.message) {
        showFormMessage('Please fill in your name, email, and message.', 'error');
        return;
      }

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // NOTE: placeholder until the contact form is wired to Supabase.
        // At that point this block sends `data` to a Supabase table/edge function instead.
        await new Promise((resolve) => setTimeout(resolve, 500));
        showFormMessage("Message sent — thank you! I'll get back to you soon.", 'success');
        contactForm.reset();
      } catch (err) {
        showFormMessage('Something went wrong. Please try again.', 'error');
      } finally {
        submitBtn.textContent = originalLabel;
        submitBtn.disabled = false;
      }
    });
  }

  function showFormMessage(text, type) {
    let msgEl = contactForm.querySelector('.form-message');
    if (!msgEl) {
      msgEl = document.createElement('p');
      msgEl.className = 'form-message';
      contactForm.appendChild(msgEl);
    }
    msgEl.textContent = text;
    msgEl.classList.remove('success', 'error');
    msgEl.classList.add(type);
  }

});

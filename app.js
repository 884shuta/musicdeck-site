document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Effect for Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.feature, .steps li, .download-card, .support-card');
  
  if (revealElements.length > 0) {
    // Inject scroll animation helper CSS inline
    const style = document.createElement('style');
    style.textContent = `
      .reveal-item {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .reveal-item.revealed {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    // Add reveal class to targets
    revealElements.forEach(el => el.classList.add('reveal-item'));

    const observerOptions = {
      root: null, // viewport
      threshold: 0.1, // 10% of element visible
      rootMargin: '0px 0px -50px 0px' // offset
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animates only once
        }
      });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
  }
});

// ===== Page Loader =====
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 600);
    setTimeout(() => {
      loader.remove();
    }, 1100);
  }
});

// ===== Mobile Nav Toggle =====
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  mainNav.classList.toggle('open');
});

// Close nav when a link is clicked
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    mainNav.classList.remove('open');
  });
});

// ===== Gallery Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== Lightbox =====
const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
lightbox.innerHTML = `
  <button class="lightbox-close" aria-label="Close">&times;</button>
  <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>
  <button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>
  <img src="" alt="Gallery image">
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');
let currentIndex = 0;

function getVisibleItems() {
  return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
}

function openLightbox(index) {
  const visible = getVisibleItems();
  currentIndex = index;
  const img = visible[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const visible = getVisibleItems();
    const index = visible.indexOf(item);
    if (index !== -1) openLightbox(index);
  });
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  const visible = getVisibleItems();
  currentIndex = (currentIndex - 1 + visible.length) % visible.length;
  const img = visible[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
});

lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  const visible = getVisibleItems();
  currentIndex = (currentIndex + 1) % visible.length;
  const img = visible[currentIndex].querySelector('img');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
});

// Keyboard nav for lightbox
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});

// ===== Contact Form =====
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.innerHTML = `
      <div class="form-success">
        <h3>Thank You!</h3>
        <p>We've received your message and will get back to you within 24 hours.</p>
      </div>
    `;
  });
}

// ===== Scroll Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add fade-in to key elements
document.querySelectorAll('.service-card, .gallery-item, .info-card, .about-image, .about-text, .highlight, .stat').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== Animated Stats Counter =====
let statsCounted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsCounted) {
      statsCounted = true;
      document.querySelectorAll('.stat-number').forEach(num => {
        const target = parseInt(num.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const counter = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(counter);
          }
          num.textContent = Math.floor(current);
        }, 16);
      });
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ===== Back to Top Button =====
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  // Header background
  const header = document.querySelector('.site-header');
  if (window.scrollY > 100) {
    header.style.background = 'rgba(15, 27, 51, 0.98)';
  } else {
    header.style.background = '';
  }

  // Back to top visibility
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

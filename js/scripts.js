const navbar = document.querySelector('.navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-navigation');
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
const lightbox = document.querySelector('.gallery-lightbox');

function updateScrollUI() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

    progressBar.style.transform = `scaleX(${progress})`;
    navbar.classList.toggle('is-scrolled', window.scrollY > 24);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
}

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('resize', updateScrollUI);

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    menuToggle.setAttribute('aria-label', isExpanded ? 'Abrir menú' : 'Cerrar menú');
    navigation.classList.toggle('is-open', !isExpanded);
});

navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        navigation.classList.remove('is-open');
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        navigation.classList.remove('is-open');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealTargets = document.querySelectorAll(
    'section h2, .about p, .card, .gallery-grid img, .step, .member, .contact p, .contact .btn'
);

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealTargets.forEach((element) => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
}

const galleryImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');

document.querySelectorAll('.gallery-grid img').forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute('aria-haspopup', 'dialog');

    const openLightbox = () => {
        galleryImage.src = image.currentSrc || image.src;
        galleryImage.alt = image.alt;
        lightboxCaption.textContent = image.alt;
        lightbox.showModal();
    };

    image.addEventListener('click', openLightbox);
    image.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openLightbox();
        }
    });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        lightbox.close();
    }
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        document.querySelectorAll('#main-navigation a').forEach((link) => {
            link.classList.toggle('is-active', link.hash === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-35% 0px -55% 0px' });

document.querySelectorAll('section[id]').forEach((section) => sectionObserver.observe(section));

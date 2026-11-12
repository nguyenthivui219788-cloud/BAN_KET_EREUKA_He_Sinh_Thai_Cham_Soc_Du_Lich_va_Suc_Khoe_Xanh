// ===== HEADER SCROLL EFFECT =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU DRAWER =====
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

if (hamburger && nav) {
    // Inject overlay if not already present
    let navOverlay = document.getElementById('nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        navOverlay.id = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    // Inject mobile login button inside drawer if not already present
    if (!nav.querySelector('.nav-mobile-login')) {
        const mobileLogin = document.createElement('a');
        mobileLogin.href = 'dang-nhap.html';
        mobileLogin.className = 'nav-mobile-login';
        mobileLogin.innerHTML = `
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Đăng nhập hệ thống</span>
        `;
        nav.appendChild(mobileLogin);
    }

    function toggleMenu(forceState) {
        const willOpen = typeof forceState === 'boolean' ? forceState : !nav.classList.contains('open');
        nav.classList.toggle('open', willOpen);
        hamburger.classList.toggle('active', willOpen);
        navOverlay.classList.toggle('active', willOpen);
        document.body.classList.toggle('nav-locked', willOpen);
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    nav.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    navOverlay.addEventListener('click', () => toggleMenu(false));

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('.nav-link, .nav-mobile-login').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            toggleMenu(false);
        }
    });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.nav-link');
let navScrollLocked = false;
let navScrollUnlockTimer = null;

function updateActiveNav() {
    if (navScrollLocked) return;
    const scrollY = window.scrollY + 100;
    
    // Check if we have scrolled to the bottom of the page
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 25);

    if (isAtBottom) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#footer') {
                link.classList.add('active');
            }
        });
        return;
    }

    sections.forEach(section => {
        const top = section.offsetTop - 80;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollY >= top && scrollY < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply fade-in and scroll reveal animations dynamically
document.addEventListener('DOMContentLoaded', () => {
    // Slide in from left
    document.querySelectorAll('.intro-left, .hero-content').forEach(el => {
        el.classList.add('fade-in-left');
        observer.observe(el);
    });

    // Slide in from right
    document.querySelectorAll('.intro-right').forEach(el => {
        el.classList.add('fade-in-right');
        observer.observe(el);
    });

    // Zoom in
    document.querySelectorAll('.health-box-new, .cta-inner').forEach(el => {
        el.classList.add('zoom-in');
        observer.observe(el);
    });

    // Staggered fade in for cards and section titles
    const elements = document.querySelectorAll(
        '.card, .stat-card, .intro-tall-card, .section-header, .footer-col'
    );
    
    elements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 5) * 0.09}s`;
        observer.observe(el);
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            const clickedNavLink = this.classList.contains('nav-link') ? this : null;
            if (clickedNavLink) {
                navScrollLocked = true;
                navLinks.forEach(link => link.classList.toggle('active', link === clickedNavLink));
                clearTimeout(navScrollUnlockTimer);
            }
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 72;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            history.replaceState(null, '', targetId);
            if (clickedNavLink) {
                navScrollUnlockTimer = setTimeout(() => {
                    navScrollLocked = false;
                    updateActiveNav();
                }, 850);
            }
        }
    });
});

if ('onscrollend' in window) {
    window.addEventListener('scrollend', () => {
        if (!navScrollLocked) return;
        clearTimeout(navScrollUnlockTimer);
        navScrollLocked = false;
        updateActiveNav();
    });
}

// ===== COUNT-UP ANIMATION FOR STAT NUMBERS =====
function animateCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    if (!statCards.length) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const el = card.querySelector('.stat-val');
                if (!el) return;

                const target = parseFloat(el.getAttribute('data-target'));
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
                const useDots = el.getAttribute('data-format') === 'dots';
                
                const duration = 1450;
                const startTime = performance.now();
                let previousText = '';

                function updateNumber(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out cubic tăng đều và không bị đứng/khựng ở cuối như easeOutExpo.
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const currentVal = progress === 1 ? target : target * eased;

                    let formattedVal = '';
                    if (decimals > 0) {
                        formattedVal = currentVal.toFixed(decimals).replace('.', ',');
                    } else {
                        const integerVal = Math.round(currentVal);
                        if (useDots) {
                            formattedVal = integerVal.toLocaleString('vi-VN');
                        } else {
                            formattedVal = integerVal;
                        }
                    }

                    const nextText = `${prefix}${formattedVal}${suffix}`;
                    if (nextText !== previousText) {
                        el.textContent = nextText;
                        previousText = nextText;
                    }
                    el.style.opacity = String(0.72 + eased * 0.28);
                    el.style.transform = `translateY(${(1 - eased) * 5}px)`;

                    if (progress < 1) {
                        requestAnimationFrame(updateNumber);
                    } else {
                        el.style.opacity = '';
                        el.style.transform = '';
                    }
                }

                requestAnimationFrame(updateNumber);

                counterObserver.unobserve(card);
            }
        });
    }, { threshold: 0.15 });

    statCards.forEach(card => counterObserver.observe(card));
}

document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
});

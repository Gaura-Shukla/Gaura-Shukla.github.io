document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. SCROLL REVEAL ───────────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── 2. NAVBAR SCROLL + ACTIVE LINKS + MOBILE MENU ──────────────────
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('active-menu');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksList.classList.remove('active-menu');
        });
    });

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(section => {
            if (scrollY >= (section.offsetTop - section.clientHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').includes(current));
        });
    });

    // ─── 3. SMOOTH SCROLLING ────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ─── 4. CARD HOVER TILT (3D effect on Terminal Windows) ─────────────
    document.querySelectorAll('.terminal-window').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // ─── 5. SKILLS BARS (JS-rendered — formatter can't break these) ─────
    const skillSets = {
        'skills-net': [
            { label: 'ROUTING/SWITCH', pct: 85 },
            { label: 'WAN/LAN & SUBNET', pct: 90 },
            { label: 'SNMP & SYSLOGS',  pct: 75 },
            { label: 'SIEM/LOG ANLYS',  pct: 80 },
            { label: 'THREAT DETECT',   pct: 75 },
        ],
        'skills-cloud': [
            { label: 'AWS IAM/EC2/S3',  pct: 70 },
            { label: 'CISCO PKT TRACER', pct: 95 },
            { label: 'WIRESHARK/NMAP',  pct: 80 },
            { label: 'GIT & MYSQL',     pct: 65 },
        ],
        'skills-prog': [
            { label: 'HTML/CSS/JS',     pct: 80 },
            { label: 'JAVA (CORE)',     pct: 60 },
            { label: 'SQL',             pct: 70 },
        ],
    };

    const BAR_LEN = 20; // Total bar characters

    Object.entries(skillSets).forEach(([id, skills]) => {
        const container = document.getElementById(id);
        if (!container) return;
        skills.forEach(({ label, pct }) => {
            const filled = Math.round((pct / 100) * BAR_LEN);
            const empty  = BAR_LEN - filled;
            const bar    = '[' + '|'.repeat(filled) + '.'.repeat(empty) + '] ' + pct + '%';
            const div    = document.createElement('div');
            div.className = 'stat-line';
            div.innerHTML = `<span>${label}</span><span class="bar">${bar}</span>`;
            container.appendChild(div);
        });
    });

    // ─── 6. INTERACTIVE TUBES BACKGROUND ────────────────────────────────
    const canvas = document.getElementById('tubes-canvas');
    let tubesApp = null;

    const randomColors = (count) =>
        new Array(count).fill(0).map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));

    const initTubes = async () => {
        if (!canvas) return;
        try {
            const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
            tubesApp = module.default(canvas, {
                tubes: {
                    colors: ['#33ff00', '#1f521f', '#ffb000'],
                    lights: { intensity: 200, colors: ['#33ff00', '#ffb000', '#ffffff', '#1f521f'] }
                }
            });
        } catch (err) {
            console.error('Tubes background failed to load:', err);
        }
    };

    initTubes();

    document.addEventListener('click', (e) => {
        if (e.target.closest('a') || e.target.tagName.toLowerCase() === 'button') return;
        if (tubesApp) {
            tubesApp.tubes.setColors(randomColors(3));
            tubesApp.tubes.setLightsColors(randomColors(4));
        }
    });

    // ─── 7. TYPEWRITER EFFECT ────────────────────────────────────────────
    const typewriterEl = document.querySelector('.typewriter-text');
    if (typewriterEl) {
        const textNode = typewriterEl.childNodes[0];
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            const original = textNode.nodeValue;
            textNode.nodeValue = '';
            let i = 0;
            const type = () => {
                if (i < original.length) {
                    textNode.nodeValue += original.charAt(i++);
                    setTimeout(type, 50);
                }
            };
            setTimeout(type, 500);
        }
    }

    // ─── 8. CONTACT FORM ────────────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('SYSTEM MESSAGE: Your message has been securely transmitted. I will get back to you shortly.');
            contactForm.reset();
        });
    }

});

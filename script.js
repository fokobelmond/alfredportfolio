/* ═══════════════════════════════════════════════════════════════════════════
   CV DIGITAL ÉLITE — INTERACTIONS & ANIMATIONS
   JavaScript Premium pour une expérience utilisateur exceptionnelle
═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────
const CONFIG = {
    preloaderDuration: 2200,
    letterRevealDelay: 50,
    scrollThreshold: 50,
    observerThreshold: 0.15,
    formValidationDelay: 300
};

// ─────────────────────────────────────────────────────────────────────────
// THEME TOGGLE (DARK MODE)
// ─────────────────────────────────────────────────────────────────────────
class ThemeToggle {
    constructor() {
        this.toggle = document.querySelector('.theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Appliquer le thème sauvegardé
        this.applyTheme(this.currentTheme);
        
        // Écouter le clic sur le toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Écouter les préférences système
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Mettre à jour le meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0D1117' : '#003366');
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Animation du bouton
        if (this.toggle) {
            this.toggle.style.transform = 'rotate(360deg) scale(1.1)';
            setTimeout(() => {
                this.toggle.style.transform = '';
            }, 300);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────
// PRELOADER
// ─────────────────────────────────────────────────────────────────────────
class Preloader {
    constructor() {
        this.element = document.querySelector('.preloader');
        this.init();
    }

    init() {
        if (!this.element) return;
        
        // Prevent scroll during loading
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.hide();
        }, CONFIG.preloaderDuration);
    }

    hide() {
        this.element.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Trigger hero animations after preloader
        setTimeout(() => {
            this.triggerHeroAnimations();
        }, 300);
    }

    triggerHeroAnimations() {
        // Reveal name letters
        const nameElement = document.querySelector('.hero__name');
        if (nameElement) {
            const letters = nameElement.querySelectorAll('.letter');
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.classList.add('revealed');
                }, index * CONFIG.letterRevealDelay);
            });
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────
// NAME LETTER ANIMATION
// ─────────────────────────────────────────────────────────────────────────
class NameReveal {
    constructor() {
        this.nameElement = document.querySelector('.hero__name');
        this.name = "Emile Alfred Carrel EDZOA";
        this.init();
    }

    init() {
        if (!this.nameElement) return;
        
        // Clear existing content and create letter spans
        this.nameElement.innerHTML = '';
        
        this.name.split('').forEach((char) => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = char === ' ' ? '\u00A0' : char;
            this.nameElement.appendChild(span);
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────
// TRUST LINE (Scroll Progress)
// ─────────────────────────────────────────────────────────────────────────
class TrustLine {
    constructor() {
        this.element = document.querySelector('.trust-line');
        this.init();
    }

    init() {
        if (!this.element) return;
        
        window.addEventListener('scroll', () => this.update(), { passive: true });
        this.update();
    }

    update() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = (window.scrollY / scrollHeight) * 100;
        this.element.style.height = `${Math.min(scrollProgress, 100)}%`;
    }
}

// ─────────────────────────────────────────────────────────────────────────
// HEADER SCROLL EFFECTS
// ─────────────────────────────────────────────────────────────────────────
class Header {
    constructor() {
        this.element = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.init();
    }

    init() {
        if (!this.element) return;
        
        // Scroll effect
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Active link tracking
        this.setupActiveTracking();
    }

    handleScroll() {
        if (window.scrollY > CONFIG.scrollThreshold) {
            this.element.classList.add('scrolled');
        } else {
            this.element.classList.remove('scrolled');
        }
    }

    setupActiveTracking() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' });

        sections.forEach(section => observer.observe(section));
    }
}

// ─────────────────────────────────────────────────────────────────────────
// MOBILE MENU — REFONTE COMPLÈTE
// ─────────────────────────────────────────────────────────────────────────
class MobileMenu {
    constructor() {
        this.burger = document.getElementById('navBurger');
        this.menu = document.getElementById('mobileMenu');
        this.overlay = this.menu?.querySelector('.mobile-menu__overlay');
        this.panel = this.menu?.querySelector('.mobile-menu__panel');
        this.links = this.menu?.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
        this.isOpen = false;
        this.focusableElements = [];
        this.firstFocusable = null;
        this.lastFocusable = null;
        
        this.init();
    }

    init() {
        if (!this.burger || !this.menu) return;
        
        // Get focusable elements for trap
        this.focusableElements = this.menu.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (this.focusableElements.length > 0) {
            this.firstFocusable = this.focusableElements[0];
            this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];
        }
        
        // Burger click
        this.burger.addEventListener('click', () => this.toggle());
        
        // Overlay click to close
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }
        
        // Close on link click
        this.links?.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Close on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900 && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        
        // Update states
        this.burger.classList.add('is-active');
        this.burger.setAttribute('aria-expanded', 'true');
        this.burger.setAttribute('aria-label', 'Fermer le menu');
        
        this.menu.classList.add('is-open');
        this.menu.setAttribute('aria-hidden', 'false');
        
        // Lock body scroll
        document.body.classList.add('menu-open');
        
        // Focus first link after animation
        setTimeout(() => {
            if (this.firstFocusable) {
                this.firstFocusable.focus();
            }
        }, 400);
    }

    close() {
        this.isOpen = false;
        
        // Update states
        this.burger.classList.remove('is-active');
        this.burger.setAttribute('aria-expanded', 'false');
        this.burger.setAttribute('aria-label', 'Ouvrir le menu');
        
        this.menu.classList.remove('is-open');
        this.menu.setAttribute('aria-hidden', 'true');
        
        // Unlock body scroll
        document.body.classList.remove('menu-open');
        
        // Return focus to burger
        this.burger.focus();
    }

    handleKeydown(e) {
        if (!this.isOpen) return;
        
        // Close on Escape
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
            return;
        }
        
        // Focus trap on Tab
        if (e.key === 'Tab') {
            // If shift+tab on first element, go to last
            if (e.shiftKey && document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable?.focus();
            }
            // If tab on last element, go to first
            else if (!e.shiftKey && document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable?.focus();
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────
// SCROLL ANIMATIONS (Intersection Observer)
// ─────────────────────────────────────────────────────────────────────────
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Sections
        this.observeSections();
        
        // Timeline items
        this.observeTimeline();
        
        // Skill cards
        this.observeSkills();
        
        // Soft skills
        this.observeSoftSkills();
        
        // Seal
        this.observeSeal();
    }

    observeSections() {
        const sections = document.querySelectorAll('.section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: CONFIG.observerThreshold, rootMargin: '0px 0px -50px 0px' });

        sections.forEach(section => observer.observe(section));
    }

    observeTimeline() {
        const items = document.querySelectorAll('.timeline__item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 150);
                }
            });
        }, { threshold: 0.2 });

        items.forEach(item => observer.observe(item));
    }

    observeSkills() {
        const cards = document.querySelectorAll('.skill-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });

        cards.forEach(card => observer.observe(card));
    }

    observeSoftSkills() {
        const skills = document.querySelectorAll('.soft-skill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                }
            });
        }, { threshold: 0.5 });

        skills.forEach(skill => observer.observe(skill));
    }

    observeSeal() {
        const seal = document.querySelector('.seal__monogram');
        if (!seal) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.5 });

        observer.observe(seal);
    }
}

// ─────────────────────────────────────────────────────────────────────────
// SCROLL TO TOP BUTTON
// ─────────────────────────────────────────────────────────────────────────
class ScrollToTop {
    constructor() {
        this.element = document.querySelector('.scroll-top');
        this.init();
    }

    init() {
        if (!this.element) return;
        
        window.addEventListener('scroll', () => this.toggleVisibility(), { passive: true });
        this.element.addEventListener('click', () => this.scrollToTop());
    }

    toggleVisibility() {
        if (window.scrollY > 500) {
            this.element.classList.add('visible');
        } else {
            this.element.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────
// SMOOTH SCROLL
// ─────────────────────────────────────────────────────────────────────────
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────
// FORM VALIDATION
// ─────────────────────────────────────────────────────────────────────────
class FormValidation {
    constructor() {
        this.form = document.querySelector('.contact__form');
        this.inputs = {};
        this.init();
    }

    init() {
        if (!this.form) return;
        
        // Get form elements
        this.inputs = {
            name: this.form.querySelector('#name'),
            email: this.form.querySelector('#email'),
            subject: this.form.querySelector('#subject'),
            message: this.form.querySelector('#message')
        };
        
        this.submitBtn = this.form.querySelector('.form__submit');
        this.successMessage = this.form.querySelector('.form__success');
        
        // Add validation listeners
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearError(input));
            }
        });
        
        // Form submit
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.id;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Le nom doit contenir au moins 2 caractères';
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Veuillez entrer une adresse email valide';
                }
                break;
                
            case 'subject':
                if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'L\'objet doit contenir au moins 3 caractères';
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Le message doit contenir au moins 10 caractères';
                }
                break;
        }

        if (!isValid) {
            this.showError(input, errorMessage);
        } else {
            this.showSuccess(input);
        }

        return isValid;
    }

    showError(input, message) {
        input.classList.remove('success');
        input.classList.add('error');
        
        const errorElement = input.parentElement.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    showSuccess(input) {
        input.classList.remove('error');
        input.classList.add('success');
        
        const errorElement = input.parentElement.querySelector('.form__error');
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    }

    clearError(input) {
        if (input.classList.contains('error')) {
            input.classList.remove('error');
            const errorElement = input.parentElement.querySelector('.form__error');
            if (errorElement) {
                errorElement.classList.remove('visible');
            }
        }
    }

    validateAll() {
        let isValid = true;
        
        Object.values(this.inputs).forEach(input => {
            if (input && !this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateAll()) {
            // Shake the submit button
            this.submitBtn.style.animation = 'shake 0.4s ease';
            setTimeout(() => {
                this.submitBtn.style.animation = '';
            }, 400);
            return;
        }
        
        // Show loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.textContent = 'Envoi en cours...';
        
        // Simulate form submission
        setTimeout(() => {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.textContent = 'Message envoyé !';
            this.submitBtn.style.background = 'var(--success)';
            
            // Hide form fields and show success message
            const formGroups = this.form.querySelectorAll('.form__group');
            formGroups.forEach(group => {
                group.style.display = 'none';
            });
            this.submitBtn.style.display = 'none';
            
            if (this.successMessage) {
                this.successMessage.classList.add('visible');
            }
            
            // Reset form after delay
            setTimeout(() => {
                this.resetForm();
            }, 5000);
            
        }, 2000);
    }

    resetForm() {
        this.form.reset();
        
        Object.values(this.inputs).forEach(input => {
            if (input) {
                input.classList.remove('success', 'error');
            }
        });
        
        this.submitBtn.textContent = 'Envoyer le message';
        this.submitBtn.style.background = '';
        this.submitBtn.style.display = '';
        
        const formGroups = this.form.querySelectorAll('.form__group');
        formGroups.forEach(group => {
            group.style.display = '';
        });
        
        if (this.successMessage) {
            this.successMessage.classList.remove('visible');
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────
// HOVER EFFECTS ENHANCEMENT
// ─────────────────────────────────────────────────────────────────────────
class HoverEffects {
    constructor() {
        this.init();
    }

    init() {
        // Card tilt effect
        this.initCardTilt();
        
        // Magnetic buttons
        this.initMagneticButtons();
    }

    initCardTilt() {
        const cards = document.querySelectorAll('.skill-card, .formation-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn--primary, .btn--gold');
        
        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────
// PARALLAX EFFECTS
// ─────────────────────────────────────────────────────────────────────────
class ParallaxEffects {
    constructor() {
        this.init();
    }

    init() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight) * 0.5;
                const scale = 1 + (scrolled / heroHeight) * 0.1;
                
                hero.style.setProperty('--parallax-opacity', opacity);
                hero.style.setProperty('--parallax-scale', scale);
            }
        }, { passive: true });
    }
}

// ─────────────────────────────────────────────────────────────────────────
// TYPING EFFECT FOR TITLE
// ─────────────────────────────────────────────────────────────────────────
class TypingEffect {
    constructor() {
        this.element = document.querySelector('.hero__title-text');
        this.texts = [
            'Chargé d\'Affaires en Alternance',
            'Bachelor Banque Assurance',
            'Passionné par la Finance'
        ];
        this.currentIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element) return;
        // Typing effect disabled for professional look
        // Uncomment below to enable
        // this.type();
    }

    type() {
        const current = this.texts[this.currentIndex];
        
        if (this.isDeleting) {
            this.element.textContent = current.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = current.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let typeSpeed = this.isDeleting ? 50 : 100;
        
        if (!this.isDeleting && this.charIndex === current.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// ─────────────────────────────────────────────────────────────────────────
// COUNTER ANIMATION
// ─────────────────────────────────────────────────────────────────────────
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-counter]');
        this.init();
    }

    init() {
        if (this.counters.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ─────────────────────────────────────────────────────────────────────────
// INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Theme (initialize first for immediate application)
    new ThemeToggle();
    
    // Core features
    new NameReveal();
    new Preloader();
    new TrustLine();
    new Header();
    new MobileMenu(); // New mobile menu
    new SmoothScroll();
    new ScrollAnimations();
    new ScrollToTop();
    
    // Enhanced interactions
    new FormValidation();
    new HoverEffects();
    new ParallaxEffects();
    new CounterAnimation();
    
    // Mark hero as visible immediately
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.classList.add('visible');
    }
});

// ─────────────────────────────────────────────────────────────────────────
// PERFORMANCE: Reduce animations for users who prefer reduced motion
// ─────────────────────────────────────────────────────────────────────────
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--ease-smooth', 'linear');
    document.documentElement.style.setProperty('--ease-bounce', 'linear');
    
    // Disable complex animations
    document.querySelectorAll('.letter').forEach(letter => {
        letter.style.transition = 'none';
        letter.style.opacity = '1';
        letter.style.filter = 'none';
        letter.style.transform = 'none';
    });
}


document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. NAVBAR SCROLL EFEKTİ ────────────────────────── */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    /* ─── 2. MOBİL MENÜ TETİKLEME (Hamburger Morph & Overlay) ── */
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.contains('active');
            if (isOpen) {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('mobile-active');
                document.body.style.overflow = '';
            } else {
                mobileMenu.classList.add('active');
                menuToggle.classList.add('mobile-active');
                document.body.style.overflow = 'hidden';
            }
        });

        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('mobile-active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ─── 3. BİYOMETRİK BMR & SU HESAPLAYICI SİMÜLATÖRÜ ───────── */
    const genderMaleBtn = document.getElementById('calc-gender-male');
    const genderFemaleBtn = document.getElementById('calc-gender-female');
    const ageInput = document.getElementById('calc-age');
    const heightInput = document.getElementById('calc-height');
    const weightInput = document.getElementById('calc-weight');
    
    const ageVal = document.getElementById('calc-age-val');
    const heightVal = document.getElementById('calc-height-val');
    const weightVal = document.getElementById('calc-weight-val');
    
    const resultBmr = document.getElementById('result-bmr');
    const resultWater = document.getElementById('result-water');
    const resultStatus = document.getElementById('result-status');

    let currentCalcGender = 'Erkek';

    if (genderMaleBtn && genderFemaleBtn && ageInput && heightInput && weightInput) {
        const calculateMetrics = () => {
            const age = parseInt(ageInput.value);
            const height = parseInt(heightInput.value);
            const weight = parseInt(weightInput.value);
            
            // Update UI labels
            if (ageVal) ageVal.textContent = age;
            if (heightVal) heightVal.textContent = height + ' cm';
            if (weightVal) weightVal.textContent = weight + ' kg';
            
            // BMR (Mifflin-St Jeor)
            let bmr = (10 * weight) + (6.25 * height) - (5 * age);
            if (currentCalcGender === 'Erkek') {
                bmr += 5;
            } else {
                bmr -= 161;
            }
            
            // Daily Water Requirement (33ml per kg)
            const water = (weight * 0.033).toFixed(1);
            
            // Update outputs in UI
            if (resultBmr) resultBmr.textContent = Math.round(bmr) + ' kcal';
            if (resultWater) resultWater.textContent = water + ' Litre';
            
            if (resultStatus) {
                if (bmr > 1900) {
                    resultStatus.textContent = 'Yüksek Metabolik Hız';
                    resultStatus.style.color = '#00FFCC';
                } else if (bmr > 1400) {
                    resultStatus.textContent = 'Dengeli Metabolizma';
                    resultStatus.style.color = '#00E5FF';
                } else {
                    resultStatus.textContent = 'Ekonomik Metabolizma';
                    resultStatus.style.color = '#FFA855';
                }
            }
        };

        // Event Listeners
        genderMaleBtn.addEventListener('click', () => {
            genderMaleBtn.classList.add('active');
            genderFemaleBtn.classList.remove('active');
            currentCalcGender = 'Erkek';
            calculateMetrics();
        });

        genderFemaleBtn.addEventListener('click', () => {
            genderFemaleBtn.classList.add('active');
            genderMaleBtn.classList.remove('active');
            currentCalcGender = 'Kadın';
            calculateMetrics();
        });

        ageInput.addEventListener('input', calculateMetrics);
        heightInput.addEventListener('input', calculateMetrics);
        weightInput.addEventListener('input', calculateMetrics);

        // Initial Calculation
        calculateMetrics();
    }

    /* ─── 5. FAQ AKORDEON (SSS) ───────────────────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    const c = i.querySelector('.faq-content');
                    if (c) c.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    /* ─── 6. DİNAMİK BİYOMETRİK VERİ DÖNGÜLERİ (BENTO 2.0) ─────── */
    
    // Canlı Nabız Simülasyonu (Bento & Hero)
    const mockHrVal = document.getElementById('mock-hr');
    const bentoHrVal = document.getElementById('bento-hr');
    if (mockHrVal || bentoHrVal) {
        setInterval(() => {
            const baseHr = 138;
            const fluctuation = Math.floor(Math.random() * 7) - 3;
            const finalHr = baseHr + fluctuation;
            if (mockHrVal) mockHrVal.textContent = `${finalHr} bpm`;
            if (bentoHrVal) bentoHrVal.textContent = `${finalHr} bpm`;
        }, 2000);
    }

    // Bento Glikojen Dalgalanması
    const bentoGlycogenVal = document.getElementById('bento-glycogen');
    let glycogenLevel = 62;
    if (bentoGlycogenVal) {
        setInterval(() => {
            const delta = Math.random() > 0.5 ? -1 : 1;
            glycogenLevel = Math.max(50, Math.min(80, glycogenLevel + delta));
            bentoGlycogenVal.textContent = `%${glycogenLevel}`;
            
            const bentoRow = bentoGlycogenVal.closest('.metric-row');
            if (bentoRow) {
                const progressInner = bentoRow.querySelector('.progress-bar-inner');
                if (progressInner) {
                    progressInner.style.width = `${glycogenLevel}%`;
                }
            }
        }, 3000);
    }



    /* ─── 7. GSAP AÇILIŞ VE SCROLL ANİMASYONLARI ──────────── */
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Sinematik sayfa giriş sekansı (Fütüristik scale ve blur efektiyle)
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.6 } });
        
        tl.from('.navbar', {
            y: -100,
            opacity: 0,
            duration: 0.9
        })
        .from('.badge-new', {
            y: 24,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 0.7
        }, '-=0.5')
        .from('.hero-title', {
            y: 40,
            opacity: 0,
            filter: 'blur(12px)',
            duration: 1.3
        }, '-=0.5')
        .from('.hero-subtitle', {
            y: 24,
            opacity: 0,
            filter: 'blur(8px)',
            duration: 1.1
        }, '-=0.7')
        .from('.hero-actions', {
            y: 20,
            opacity: 0,
            duration: 0.9
        }, '-=0.9')
        .from('.mockup-outer', {
            scale: 0.94,
            opacity: 0,
            duration: 1.8,
            ease: 'elastic.out(1, 0.9)'
        }, '-=1.3')
        .from('.floating-card', {
            opacity: 0,
            y: 30,
            stagger: 0.25,
            duration: 1.2
        }, '-=1');

        // Bento kartlarının scroll sırası (sequential cascade)
        gsap.from('.feature-card', {
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 80%',
            },
            y: 60,
            opacity: 0,
            filter: 'blur(10px)',
            stagger: 0.15,
            duration: 1.4,
            ease: 'power3.out'
        });

        // Simülatör kutusunun scroll canlandırması
        gsap.from('.simulator-outer', {
            scrollTrigger: {
                trigger: '.simulator-section',
                start: 'top 75%',
            },
            y: 60,
            opacity: 0,
            filter: 'blur(10px)',
            duration: 1.6,
            ease: 'power4.out'
        });
    } else {
        // High-fidelity local IntersectionObserver animation fallback for offline mode
        const revealElements = document.querySelectorAll('.feature-card, .simulator-outer, .hero-content > *, .mockup-outer, .floating-card');
        revealElements.forEach(el => el.classList.add('reveal'));
        
        // Instant animation for hero elements to avoid initial flash
        const heroItems = document.querySelectorAll('.hero-content > *, .mockup-outer, .floating-card');
        setTimeout(() => {
            heroItems.forEach(el => el.classList.add('show'));
        }, 100);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observe cards & simulator
        document.querySelectorAll('.feature-card, .simulator-outer').forEach(el => {
            observer.observe(el);
        });
    }

    /* ─── 8. 3D TILT ETKİLEŞİMİ (VANILLA-TILT) ────────────── */
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'));
    }
});

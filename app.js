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

    /* ─── 3. HOLOGRAFİK BİYOBELİRTEÇ RADAR SİMÜLASYONU ───────── */
    const ctx = document.getElementById('biomarkerChart');
    let biomarkerChart = null;

    function drawCanvasRadar(canvasEl, dataValues, labels) {
        const dCtx = canvasEl.getContext('2d');
        if (!dCtx) return;
        
        // Handle High-DPI screens
        const dpr = window.devicePixelRatio || 1;
        const rect = canvasEl.getBoundingClientRect();
        const w = rect.width || 320;
        const h = rect.height || 320;
        
        canvasEl.width = w * dpr;
        canvasEl.height = h * dpr;
        canvasEl.style.width = w + 'px';
        canvasEl.style.height = h + 'px';
        
        dCtx.scale(dpr, dpr);
        
        const cx = w / 2;
        const cy = h / 2;
        const maxRadius = Math.min(w, h) * 0.35;
        const sides = 5;
        
        dCtx.clearRect(0, 0, w, h);
        
        // Concentric webs
        const levels = 5;
        dCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        dCtx.lineWidth = 1;
        for (let j = 1; j <= levels; j++) {
            const r = (maxRadius / levels) * j;
            dCtx.beginPath();
            for (let i = 0; i < sides; i++) {
                const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                if (i === 0) dCtx.moveTo(x, y);
                else dCtx.lineTo(x, y);
            }
            dCtx.closePath();
            dCtx.stroke();
        }
        
        // Angle lines and Labels
        dCtx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
            const x = cx + maxRadius * Math.cos(angle);
            const y = cy + maxRadius * Math.sin(angle);
            dCtx.moveTo(cx, cy);
            dCtx.lineTo(x, y);
            
            // Text Label
            dCtx.fillStyle = '#94A3B8';
            dCtx.font = '600 10px Space Grotesk';
            const labelX = cx + (maxRadius + 20) * Math.cos(angle);
            const labelY = cy + (maxRadius + 14) * Math.sin(angle);
            dCtx.textAlign = Math.abs(Math.cos(angle)) < 0.1 ? 'center' : (Math.cos(angle) > 0 ? 'left' : 'right');
            dCtx.textBaseline = 'middle';
            dCtx.fillText(labels[i], labelX, labelY);
        }
        dCtx.stroke();
        
        // Data polygon
        dCtx.beginPath();
        dCtx.fillStyle = 'rgba(13, 148, 136, 0.18)';
        dCtx.strokeStyle = '#0D9488';
        dCtx.lineWidth = 2;
        for (let i = 0; i < sides; i++) {
            const val = dataValues[i];
            const r = (val / 100) * maxRadius;
            const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            if (i === 0) dCtx.moveTo(x, y);
            else dCtx.lineTo(x, y);
        }
        dCtx.closePath();
        dCtx.fill();
        dCtx.stroke();
        
        // Data points (Gold)
        for (let i = 0; i < sides; i++) {
            const val = dataValues[i];
            const r = (val / 100) * maxRadius;
            const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            
            dCtx.fillStyle = '#C5A880';
            dCtx.strokeStyle = '#0D9488';
            dCtx.lineWidth = 1.5;
            dCtx.beginPath();
            dCtx.arc(x, y, 4.5, 0, 2 * Math.PI);
            dCtx.fill();
            dCtx.stroke();
        }
    }

    if (ctx) {
        if (typeof Chart !== 'undefined') {
            biomarkerChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Kortizol (Stres)', 'Glikojen Deposu', 'Hücresel Yenilenme', 'Vitamin Kapasitesi', 'Metabolizma Hızı'],
                    datasets: [{
                        label: 'Biyometrik İndeks',
                        data: [50, 45, 75, 65, 75],
                        backgroundColor: 'rgba(13, 148, 136, 0.18)', // Frosted teal transparent
                        borderColor: '#0D9488', // Rich Teal line
                        borderWidth: 1.5,
                        pointBackgroundColor: '#C5A880', // Champagne Gold points
                        pointBorderColor: '#0D9488',
                        pointHoverBackgroundColor: '#0D9488',
                        pointHoverBorderColor: '#FAF8F5',
                        pointRadius: 4.5,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: '#0a0a0c',
                            titleFont: {
                                family: 'Space Grotesk',
                                size: 12
                            },
                            bodyFont: {
                                family: 'Plus Jakarta Sans',
                                size: 11
                            }
                        }
                    },
                    scales: {
                        r: {
                            min: 0,
                            max: 100,
                            ticks: {
                                display: false,
                                stepSize: 20
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.04)'
                            },
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.04)'
                            },
                            pointLabels: {
                                color: '#94A3B8',
                                font: {
                                    family: 'Space Grotesk',
                                    size: 10,
                                    weight: '600'
                                }
                            }
                        }
                    }
                }
            });
        } else {
            // High-fidelity local Canvas radar chart fallback for offline mode
            biomarkerChart = {
                data: {
                    datasets: [{
                        data: [50, 45, 75, 65, 75]
                    }]
                },
                update: function() {
                    drawCanvasRadar(ctx, this.data.datasets[0].data, ['Kortizol (Stres)', 'Glikojen Deposu', 'Hücresel Yenilenme', 'Vitamin Kapasitesi', 'Metabolizma Hızı']);
                }
            };
            // Initial call to draw
            biomarkerChart.update();
            // Handle window resize for local canvas
            window.addEventListener('resize', () => {
                if (biomarkerChart && typeof biomarkerChart.update === 'function') {
                    biomarkerChart.update();
                }
            });
        }
    }

    /* ─── 4. SİMÜLATÖR KONTROLLERİ ───────────────────────── */
    let currentGoal = 'loss'; // 'loss' (Yağ Yakımı) ya da 'gain' (Kas Kütlesi)
    let currentStrictness = 'normal'; // 'flexible', 'normal', 'strict'

    const goalBtns = document.querySelectorAll('.goal-btn');
    const strictnessBtns = document.querySelectorAll('.strictness-btn');
    const strictnessDesc = document.getElementById('strictness-desc');

    const updateSimulator = () => {
        let chartData = [50, 45, 75, 65, 75];
        let descText = "";

        if (currentGoal === 'loss') {
            if (currentStrictness === 'flexible') {
                chartData = [30, 60, 90, 75, 60];
                descText = "Sosyal ortam uyumlu, yavaş ve dengeli gelişim. Kalori hedefleri %20 esnetilir, antrenman süreleri %20 kısaltılır. Biyolojik stres (kortizol) minimum düzeydedir.";
            } else if (currentStrictness === 'normal') {
                chartData = [50, 45, 75, 65, 75];
                descText = "Bilimsel sürelere ve standart yoğunluğa sadık kalınır. Kalori hedefleri kararlı şekilde dengelenir. Biyobelirteçler optimize edilmiştir.";
            } else if (currentStrictness === 'strict') {
                chartData = [85, 30, 40, 50, 90];
                descText = "Kilo verme hızını ve disiplini maksimuma çıkarır. Karbonhidrat ve yağ hedefleri %20 kısılır, antrenman hacmi %20 uzatılır. Stres hormonu artışı izlenmelidir.";
            }
        } else {
            if (currentStrictness === 'flexible') {
                chartData = [35, 70, 85, 80, 65];
                descText = "Temiz kazanım (clean bulk) odaklı esnek kalori fazlası. Minimum yağ kazanımı hedeflenir. Antrenmanlar toparlanma önceliklidir.";
            } else if (currentStrictness === 'normal') {
                chartData = [45, 85, 75, 75, 80];
                descText = "Kas gelişimi için kararlı kalori fazlası ve standart hipertrofi süreleri. Glikojen depoları dolu ve hücresel yenilenme dengelidir.";
            } else if (currentStrictness === 'strict') {
                chartData = [70, 95, 60, 70, 95];
                descText = "Maksimum hacim ve güç artışı. Ağır direnç seansları ve sıkı planlanan yüksek karbonhidratlı kalori fazlası. Glikojen depoları maksimumdadır.";
            }
        }

        // Radar grafik güncelleme
        if (biomarkerChart) {
            biomarkerChart.data.datasets[0].data = chartData;
            biomarkerChart.update();
        }

        // Açıklama metni güncelleme
        if (strictnessDesc) {
            strictnessDesc.textContent = descText;
        }
    };

    // Buton olayları
    goalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            goalBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGoal = btn.getAttribute('data-goal');
            updateSimulator();
        });
    });

    strictnessBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            strictnessBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStrictness = btn.getAttribute('data-strictness');
            updateSimulator();
        });
    });

    // Varsayılan çalıştırma
    updateSimulator();

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

    // Gemini Nano Typewriter Simülasyonu
    const chatSequence = [
        {
            user: "Nabzım 160 bpm iken antrenman süresini kısaltmalı mıyım?",
            nano: "Laktat birikimi gözlemleniyor. Sonraki seti 45 sn dinlenme ile sınırlayın."
        },
        {
            user: "Kan tahlilimdeki yüksek kortizol için akşam makrosu?",
            nano: "Akşam yemeğine 30g yavaş salınımlı kompleks karbonhidrat ekleyin."
        },
        {
            user: "Sıkı kas kütlesi modunda glikojen depolarını koruma?",
            nano: "Egzersiz öncesi 0.8g/kg protein + 1.2g/kg hızlı emilen karbonhidrat tüketin."
        }
    ];

    const typedText = document.querySelector('.terminal-emulator .typed-text');
    const replyText = document.querySelector('.terminal-emulator .reply-text');
    let sequenceIndex = 0;

    function runTypewriter() {
        if (!typedText || !replyText) return;
        
        typedText.textContent = "";
        replyText.textContent = "";
        replyText.style.opacity = 0;
        
        const currentData = chatSequence[sequenceIndex];
        let charIndex = 0;
        
        function typeUser() {
            if (charIndex < currentData.user.length) {
                typedText.textContent += currentData.user.charAt(charIndex);
                charIndex++;
                setTimeout(typeUser, 30 + Math.random() * 20);
            } else {
                setTimeout(() => {
                    replyText.style.opacity = 1;
                    replyText.textContent = "Düşünülüyor...";
                    setTimeout(typeAi, 800);
                }, 400);
            }
        }
        
        let replyCharIndex = 0;
        function typeAi() {
            replyText.textContent = "";
            function typeAiLoop() {
                if (replyCharIndex < currentData.nano.length) {
                    replyText.textContent += currentData.nano.charAt(replyCharIndex);
                    replyCharIndex++;
                    setTimeout(typeAiLoop, 20 + Math.random() * 15);
                } else {
                    setTimeout(() => {
                        sequenceIndex = (sequenceIndex + 1) % chatSequence.length;
                        runTypewriter();
                    }, 4000);
                }
            }
            typeAiLoop();
        }
        
        typeUser();
    }

    // Typewriter döngüsünü başlat
    runTypewriter();

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

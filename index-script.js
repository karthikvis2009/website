document.addEventListener("DOMContentLoaded", () => {
    const featuredItems = [
        {
            name: "Kenics Helical Static Mixer",
            description: "CFD analysis of a Kenics helical static mixer. A robust case demonstrating mixing efficiency.",
            image: "cases/assets/kenics/kenics6.png",
            link: "cases/data/kenicshelicalstaticmixer.html",
            type: "CASE_STUDY"
        },
        {
            name: "Fluidized bed",
            description: "Advanced simulation of a fluidized bed showcasing particle-fluid interactions.",
            image: "cases/assets/fluidizedBed/fb.png",
            link: "cases/data/fluidizedbed.html",
            type: "CASE_STUDY"
        },
        {
            name: "Introduction to CFD Analysis",
            description: "Understanding the fundamentals of Computational Fluid Dynamics and its applications.",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
            link: "blogs/blog1.html",
            type: "BLOG_POST"
        }
    ];

    const track = document.getElementById('carousel-track');
    const indicators = document.getElementById('carousel-indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;

    // Initialize carousel
    if (track && indicators && featuredItems.length > 0) {
        featuredItems.forEach((item, idx) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = 'w-full h-full flex-shrink-0 relative group cursor-pointer';
            slide.onclick = () => window.location.href = item.link;

            const badgeColor = item.type === 'CASE_STUDY' ? 'text-[var(--terminal-green)]' : 'text-[var(--terminal-blue)]';

            slide.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover holographic-overlay group-hover:opacity-80 transition-opacity duration-300" onerror="this.src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div class="absolute bottom-12 left-8 md:left-12 right-8 max-w-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span class="mono-label ${badgeColor} font-bold mb-2 block">${item.type}</span>
                    <h3 class="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">${item.name}</h3>
                    <p class="text-slate-300 text-sm md:text-base hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">${item.description}</p>
                </div>
            `;
            track.appendChild(slide);

            // Create indicator
            const dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-[var(--terminal-green)] w-6 shadow-[0_0_8px_var(--terminal-green)]' : 'bg-slate-600'}`;
            dot.onclick = () => goToSlide(idx);
            indicators.appendChild(dot);
        });

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update indicators
            Array.from(indicators.children).forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.className = 'w-6 h-2 rounded-full bg-[var(--terminal-green)] shadow-[0_0_8px_var(--terminal-green)] transition-all duration-300';
                } else {
                    dot.className = 'w-2 h-2 rounded-full bg-slate-600 transition-all duration-300 hover:bg-slate-400';
                }
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % featuredItems.length;
            updateCarousel();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + featuredItems.length) % featuredItems.length;
            updateCarousel();
        };

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        // Auto play
        let autoPlayInterval = setInterval(nextSlide, 5000);

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 5000);
        };

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        track.addEventListener('mouseleave', resetAutoPlay);
        // Mobile Navigation Toggle
        const logoToggle = document.getElementById('logo-toggle');
        const sidebar = document.querySelector('aside');

        if (logoToggle && sidebar) {
            logoToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('sidebar-active');
            });

            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (sidebar.classList.contains('sidebar-active') && !sidebar.contains(e.target) && !logoToggle.contains(e.target)) {
                    sidebar.classList.remove('sidebar-active');
                }
            });

            // Close sidebar when clicking a link (mobile)
            sidebar.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    sidebar.classList.remove('sidebar-active');
                });
            });
        }
    });

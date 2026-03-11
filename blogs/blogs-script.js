document.addEventListener("DOMContentLoaded", () => {
    const blogPosts = [
        {
            title: "Introduction to CFD Analysis",
            excerpt: "Understanding the fundamentals of Computational Fluid Dynamics, from Navier-Stokes equations to modern applications in engineering design. This post dives into the initial setup and mental models needed to approach CFD problems.",
            date: "2024-10-14",
            readTime: "5 min read",
            tags: ["BASICS", "THEORY"],
            link: "blog1.html"
        }
    ];

    const searchInput = document.getElementById("search");
    const blogList = document.getElementById("blog-list");

    function displayBlogPosts(filter = "") {
        if (!blogList) return;
        blogList.innerHTML = "";
        blogPosts
            .filter(bp => bp.title.toLowerCase().includes(filter.toLowerCase()) || bp.excerpt.toLowerCase().includes(filter.toLowerCase()))
            .forEach((bp, idx) => {
                const article = document.createElement("a");
                article.href = bp.link;
                article.classList.add("block", "data-stream-border", "bg-black/40", "group", "overflow-hidden", "p-6", "md:p-8", "hover:bg-black/60", "transition-colors");

                const tagsHtml = bp.tags.map(tag => `<span class="bg-[var(--terminal-green)]/10 text-[var(--terminal-green)] border border-[var(--terminal-green)]/30 px-2 py-0.5 rounded-sm mono-label text-[8px] mr-2">${tag}</span>`).join('');

                article.innerHTML = `
                <div class="flex flex-col h-full cursor-pointer">
                    <div class="flex items-center justify-between mb-4 border-b border-[var(--terminal-green)]/10 pb-4">
                        <div class="flex items-center space-x-4">
                            <span class="mono-label text-[var(--terminal-green)] font-bold bg-[var(--terminal-green)]/10 px-2 py-1">POST_0${idx + 1}</span>
                            <span class="mono-data text-[10px] text-slate-400">${bp.date}</span>
                        </div>
                        <span class="mono-data text-[10px] text-[var(--terminal-blue)]">${bp.readTime}</span>
                    </div>
                    <h2 class="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[var(--terminal-green)] transition-colors">${bp.title}</h2>
                    <p class="text-sm md:text-base text-slate-400 mb-6 leading-relaxed flex-grow">
                        ${bp.excerpt}
                    </p>
                    <div class="mt-auto pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div class="flex flex-wrap gap-2">
                            ${tagsHtml}
                        </div>
                        <span class="text-xs font-semibold text-[var(--terminal-green)] flex items-center space-x-2 group-hover:translate-x-2 transition-transform">
                            <span>READ ARTICLE</span>
                            <span class="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                    </div>
                </div>
                `;
                blogList.appendChild(article);
            });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            displayBlogPosts(searchInput.value);
        });
    }

    displayBlogPosts();
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

document.addEventListener("DOMContentLoaded", () => {
    const testCases = [

        { 
            name: "Kenics Helical Static Mixer", 
            description: "CFD analysis of a Kenics helical static mixer", 
            image: "assets/kenics/kenics6.png",
        },

        { 
            name: "Rising Bubble", 
            description: "2D Simulation of a rising bubble", 
            image: "assets/risingBub/risingBub.png",
        },

        { 
            name: "Laminar flow past a cylinder", 
            description: "2D laminar flow past a cylinder", 
            image: "assets/fpcLam/fpcLam.png",
        },

        { 
            name: "Fluidized bed", 
            description: "Simulation of a fluidized bed", 
            image: "assets/fluidizedBed/fb.png",
        }
    ];

    const searchInput = document.getElementById("search");
    const testcaseList = document.getElementById("testcase-list");
    const infoSection = document.getElementById("testcase-info");
    const infoTitle = document.getElementById("info-title");
    const infoImage = document.getElementById("info-image");
    const infoDescription = document.getElementById("info-description");

    function displayTestCases(filter = "") {
        if (!testcaseList) return;
        testcaseList.innerHTML = "";
        testCases
            .filter(tc => tc.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach((tc, idx) => {
                const article = document.createElement("article");
                article.classList.add("data-stream-border", "bg-black/40", "group", "overflow-hidden");
                article.innerHTML = `
                <div class="flex flex-col md:flex-row">
                    <div class="md:w-1/3 relative border-b md:border-b-0 md:border-r border-[var(--terminal-green)]/10 aspect-video md:aspect-auto">
                        <img alt="${tc.name}" class="w-full h-full object-cover holographic-overlay group-hover:opacity-60 transition-opacity" src="${tc.image}" onerror="this.src='https://lh3.googleusercontent.com/aida-public/AB6AXuBBhes3ff5Or-kZ_x5vVMJsBvHUh-yu26LTOOiXD_JSOW7H5GU6N19aN9gMePyClohQeqb5t2FzG_gAzL3d-4bkfxJa-dhyTJXw-XmDhF0_k1cSDrMBBBgg6R90TdLQUUMU4R-02OU5_y-KIkmCypw-MJuoyWiX0RGv4QtPaLdc2B6jpOaPdcfyCf1ST_Ca-Pvj758OwdVsYsjEJPNAuMJ4WvdjdwDN3eOApZlSR1Ilw2dlNBxGvkLMKZz0kkXaZUc1JIkesRdktA'"/>
                        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                        <div class="absolute top-4 left-4 flex flex-col space-y-1">
                            <span class="mono-label bg-[var(--terminal-green)] text-black font-bold px-1.5 py-0.5 w-fit">CASE_STUDY_0${idx+1}</span>
                        </div>
                    </div>
                    <div class="md:w-2/3 p-6 md:p-8 flex flex-col">
                        <div class="flex items-center justify-between mb-4">
                            <span class="mono-label text-[var(--terminal-green)] font-bold">PROJECT: ${tc.name.toUpperCase().replace(/\s+/g, '_')}</span>
                            <span class="mono-data text-[10px] text-slate-500">CFD PORTFOLIO</span>
                        </div>
                        <h2 class="text-xl md:text-3xl font-bold text-white mb-4 leading-tight">${tc.name}</h2>
                        <p class="text-sm md:text-base text-slate-400 mb-6 leading-relaxed">
                            ${tc.description}
                        </p>
                        <div class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                            <span class="mono-label text-[var(--terminal-blue)]">Solver Details Internal</span>
                            <a class="text-xs font-semibold text-[var(--terminal-green)] flex items-center space-x-2 hover:text-white transition-colors cursor-pointer" onclick="viewDetails('${tc.name}')">
                                <span>READ WALKTHROUGH</span>
                                <span class="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </div>
                </div>
                `;
                testcaseList.appendChild(article);
            });
    }

    window.viewDetails = (name) => {
        const pageName = "data/" + name.toLowerCase().replace(/\s+/g, '') + ".html"; // Convert name to lowercase and remove spaces
        window.location.href = pageName; // Redirect to the corresponding HTML file
    };

    window.closeInfo = () => {
        infoSection.style.display = "none";
    };

    searchInput.addEventListener("input", () => {
        displayTestCases(searchInput.value);
    });

    displayTestCases();

});

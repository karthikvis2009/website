document.addEventListener("DOMContentLoaded", () => {
    const testCases = [
        { 
            name: "Airfoil", 
            description: "CFD analysis of an airfoil.", 
            image: "assets/airfoil.png",
        },
        { 
            name: "Pipe Flow", 
            description: "Laminar and turbulent flow through a pipe.", 
            image: "assets/pipeflow.png",
        }
    ];

    const searchInput = document.getElementById("search");
    const testcaseList = document.getElementById("testcase-list");
    const infoSection = document.getElementById("testcase-info");
    const infoTitle = document.getElementById("info-title");
    const infoImage = document.getElementById("info-image");
    const infoDescription = document.getElementById("info-description");

    function displayTestCases(filter = "") {
        testcaseList.innerHTML = "";
        testCases
            .filter(tc => tc.name.toLowerCase().includes(filter.toLowerCase()))
            .forEach(tc => {
                const div = document.createElement("div");
                div.classList.add("testcase");
                div.innerHTML = `
                    <img src="${tc.image}" alt="${tc.name}">
                    <h3>${tc.name}</h3>
                    <p>${tc.description}</p>
                    <button onclick="viewDetails('${tc.name}')">View Details</button>
                `;
                testcaseList.appendChild(div);
            });
    }

    window.viewDetails = (name) => {
        // const testCase = testCases.find(tc => tc.name === name);
        // if (testCase) {
        //     infoTitle.textContent = testCase.name;
        //     infoImage.src = testCase.image;
        //     infoImage.alt = testCase.name;
        //     infoDescription.textContent = testCase.description;
        //     infoSection.style.display = "block";
        // }
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

// new-report.html form logic

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("report-form");
    const facilitySelect = document.getElementById("facilitySelect");
    const issueType = document.getElementById("issue");
    const description = document.getElementById("desc");
    const successBox = document.getElementById("success-box");

    // Populate facility dropdown from backend
    fetch("http://localhost:3000/facilities")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((facility) => {
                const option = document.createElement("option");
                option.value = facility.name;
                option.textContent = facility.name;
                facilitySelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error("Failed to fetch facilities:", error);
        });

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const payload = {
                facility: facilitySelect.value,
                issueType: issueType.value,
                description: description.value,
                reportedBy: "مستخدم النظام",
                reportedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
                status: "open"
            };

            fetch("http://localhost:3000/incidents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then((res) => res.json())
                .then(() => {
                    successBox.style.display = "block";
                    form.reset();
                    setTimeout(() => {
                        successBox.style.display = "none";
                    }, 3000);
                })
                .catch((err) => {
                    console.error("Failed to submit report:", err);
                });
        });
    }
});

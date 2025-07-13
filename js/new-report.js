
// new-report.html form logic
const form = document.querySelector("form");
if (form) {
    const successBox = document.getElementById("success-box");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const facility = document.getElementById("facility").value.trim();
        const issue = document.getElementById("issue").value.trim();
        const desc = document.getElementById("desc").value.trim();

        if (!facility || !issue || !desc) {
            alert("يرجى تعبئة جميع الحقول.");
            return;
        }

        const newIncident = {
            id: Date.now(),
            facility,
            issueType: issue,
            description: desc,
            reportedBy: "مستخدم النظام", // Placeholder user
            reportedAt: new Date().toLocaleString("sv-SE").replace("T", " "),
            status: "pending"
        };

        fetch("http://localhost:3000/incidents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newIncident)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to submit");
                return res.json();
            })
            .then(data => {
                console.log("Success:", data);
                form.reset();
                successBox.classList.add("visible")
                setTimeout(() => successBox.classList.remove("visible"), 4000);
            })
            .catch(err => {
                console.error("Error submitting incident:", err);
                alert("تعذر إرسال البلاغ. حاول مرة أخرى.");
            });
    });
}
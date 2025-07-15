// فلترة التنبيهات
document.getElementById("filterType").addEventListener("change", function () {
  const value = this.value.toUpperCase(); // Only declare once
  document.querySelectorAll(".notification-card").forEach((card) => {
    const matches = value === "ALL" || card.classList.contains(value);
    card.style.display = matches ? "block" : "none";
  });
});


// بحث بالكلمات
document.getElementById("searchInput").addEventListener("input", function () {
  const val = this.value.toLowerCase();
  document.querySelectorAll(".notification-card").forEach((card) => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(val) ? "block" : "none";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".notification-list");

  fetch("http://localhost:3000/notifications")
    .then((res) => res.json())
    .then((notifications) => {
      container.innerHTML = ""; // Clear old static HTML

      notifications
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Most recent first
        .forEach((notif) => {
          const card = document.createElement("div");
          card.className = `notification-card ${notif.severity}`;

          card.innerHTML = `
            <h3>${notif.title}</h3>
            <p>${notif.description}</p>
            <span class="timestamp">${notif.timestamp}</span>
          `;

          container.appendChild(card);
        });
    })
    .catch((err) => {
      console.error("Failed to load notifications:", err);
    });
});

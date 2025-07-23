document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".notification-list");
  const filterType = document.getElementById("filterType");
  const filterStatus = document.getElementById("filterStatus");
  const searchInput = document.getElementById("searchInput");

  fetch("http://localhost:3000/notifications")
    .then((res) => res.json())
    .then((notifications) => {
      function filterNotifications() {
        const severityFilter = filterType.value;
        const statusFilter = filterStatus.value;
        const searchTerm = searchInput.value.toLowerCase().trim();

        const filteredNotifications = notifications.filter((notif) => {
          const matchesSeverity =
            severityFilter === "ALL" || notif.severity === severityFilter;
          const matchesStatus =
            statusFilter === "ALL" || notif.status === statusFilter;
          const matchesSearch = notif.title.toLowerCase().includes(searchTerm);

          return matchesSeverity && matchesStatus && matchesSearch;
        });

        container.innerHTML = "";
        filteredNotifications.forEach((notif) => {
          const card = document.createElement("div");
          card.classList.add("notification-card", notif.severity);

          let icon = "";
          let iconColor = "";

          switch (notif.severity) {
            case "P":
              icon = `<i class="fa fa-check-circle"></i>`;
              iconColor = "green";
              break;
            case "L":
              icon = `<i class="fa fa-exclamation-circle"></i>`;
              iconColor = "lightorange";
              break;
            case "M":
              icon = `<i class="fa fa-exclamation-triangle"></i>`;
              iconColor = "orange";
              break;
            case "H":
              icon = `<i class="fa fa-times-circle"></i>`;
              iconColor = "red";
              break;
          }

          card.innerHTML = `
      <div class="icon" style="color: ${iconColor};">${icon}</div>
      <div class="content">
        <h3>${notif.title}</h3>
        <p>${notif.description}</p>
        <span class="timestamp">🕒 ${notif.timestamp}</span>
      </div>
    `;

          container.appendChild(card);
        });
      }

      filterType.addEventListener("change", filterNotifications);
      filterStatus.addEventListener("change", filterNotifications);
      searchInput.addEventListener("input", filterNotifications);

      filterNotifications();
    })
    .catch((err) => {
      console.error("فشل في تحميل التنبيهات:", err);
    });
});

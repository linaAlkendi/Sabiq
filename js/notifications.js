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
          const matchesSearch = notif.title.toLowerCase().startsWith(searchTerm);

          return matchesSeverity && matchesStatus && matchesSearch;
        });

        container.innerHTML = "";
        filteredNotifications.forEach((notif) => {
          const card = document.createElement("div");
          card.classList.add("notification-card", notif.severity);

          let icon = '';
          let iconColor = '';

          if (notif.severity === "P") {
            icon = `<i class="fa fa-check-circle"></i>`;
            iconColor = 'green';
          } else if (notif.severity === "L") {
            icon = `<i class="fa fa-exclamation-circle"></i>`;
            iconColor = 'lightorange';
          } else if (notif.severity === "M") {
            icon = `<i class="fa fa-exclamation-triangle"></i>`;
            iconColor = 'orange';
          } else if (notif.severity === "H") {
            icon = `<i class="fa fa-times-circle"></i>`;
            iconColor = 'red';
          }

          card.innerHTML = `
            <div class="icon" style="color: ${iconColor};">${icon}</div>
            <div class="content">
              <h3>${notif.title}</h3>
              <p>${notif.description}</p>
              <span class="timestamp">${notif.timestamp}</span>
            </div>
          `;

          if (notif.status === "negative") {
            card.innerHTML += `
              <button class="assign-task-btn" onclick="assignTask('${notif.title}')">إسناد مهمة</button>
            `;
          }

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

function assignTask(taskTitle) {
  window.location.href = `supervisor-dashboard.html?task=${encodeURIComponent(taskTitle)}`;
}

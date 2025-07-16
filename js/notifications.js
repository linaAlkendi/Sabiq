document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".notification-list");
  const filterType = document.getElementById("filterType");
  const filterStatus = document.getElementById("filterStatus");
  const searchInput = document.getElementById("searchInput");

  // جلب التنبيهات من السيرفر
  fetch("http://localhost:3000/notifications")
    .then((res) => res.json()) // تحويل الاستجابة إلى JSON
    .then((notifications) => {
      // فلترة التنبيهات بناءً على الفلاتر
      function filterNotifications() {
        const severityFilter = filterType.value;
        const statusFilter = filterStatus.value;
        const searchTerm = searchInput.value.toLowerCase().trim(); // البحث بحرف أو كلمة

        // تصفية التنبيهات بناءً على الفلاتر
        const filteredNotifications = notifications.filter((notif) => {
          const matchesSeverity =
            severityFilter === "ALL" || notif.severity === severityFilter;
          const matchesStatus =
            statusFilter === "ALL" || notif.status === statusFilter;
          const matchesSearch = notif.title.toLowerCase().startsWith(searchTerm); // البحث عن بداية الكلمة

          return matchesSeverity && matchesStatus && matchesSearch;
        });

        // تحديث عرض التنبيهات
        container.innerHTML = "";
        filteredNotifications.forEach((notif) => {
          const card = document.createElement("div");
          card.classList.add("notification-card", notif.severity);

          card.innerHTML = `
            <h3>${notif.title}</h3>
            <p>${notif.description}</p>
            <span class="timestamp">${notif.timestamp}</span>
          `;

          // إظهار زر إسناد مهمة فقط في التنبيهات السلبية
          if (notif.status === "negative") {
            card.innerHTML += `
              <button class="assign-task-btn" onclick="assignTask('${notif.title}')" >إسناد مهمة</button>
            `;
          }

          container.appendChild(card);
        });
      }

      // إضافة أحداث الفلاتر
      filterType.addEventListener("change", filterNotifications);
      filterStatus.addEventListener("change", filterNotifications);
      searchInput.addEventListener("input", filterNotifications); // إضافة حدث البحث

      // عرض التنبيهات عند تحميل الصفحة
      filterNotifications();
    })
    .catch((err) => {
      console.error("فشل في تحميل التنبيهات:", err);
    });
});

// وظيفة إسناد المهمة
function assignTask(taskTitle) {
  // توجيه المستخدم إلى صفحة المشرف مع تمرير عنوان المهمة
  window.location.href = `supervisor-dashboard.html?task=${encodeURIComponent(taskTitle)}`;
}

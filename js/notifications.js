document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".notification-list");
  const filterType = document.getElementById("filterType");
  const filterStatus = document.getElementById("filterStatus");

  // بيانات التنبيهات
  const notifications = [
    {
      title: "سلم كهربائي 1 عاد للعمل",
      description: "سلم كهربائي تم تشغيله بعد إجراء الصيانة.",
      severity: "L", // منخفض
      status: "positive", // إيجابي
      timestamp: "الآن"
    },
    {
      title: "النظام بحاجة لصيانة استباقية",
      description: "النظام يتوقع حدوث عطل في المستقبل القريب.",
      severity: "M", // متوسط
      status: "negative", // سلبي
      timestamp: "قبل ساعة "
    },
    {
      title: "مصعد 5 تحمّل فوق طاقته",
      description: "المصعد تحمل فوق طاقته ويحتاج إلى صيانة فورية.",
      severity: "H", // عالي
      status: "negative", // سلبي
      timestamp: "قبل 25 دقيقة"
    }
  ];

  // فلترة التنبيهات بناءً على الفلاتر
  function filterNotifications() {
    const severityFilter = filterType.value;
    const statusFilter = filterStatus.value;

    // تصفية التنبيهات بناءً على الفلاتر
    const filteredNotifications = notifications.filter((notif) => {
      const matchesSeverity =
        severityFilter === "ALL" || notif.severity === severityFilter;
      const matchesStatus =
        statusFilter === "ALL" || notif.status === statusFilter;

      return matchesSeverity && matchesStatus;
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
          <button class="assign-task-btn" onclick="assignTask('${notif.title}')" >إسناد مهمة </button>
        `;
      }

      container.appendChild(card);
    });
  }

  // إضافة أحداث الفلاتر
  filterType.addEventListener("change", filterNotifications);
  filterStatus.addEventListener("change", filterNotifications);

  // عرض التنبيهات عند تحميل الصفحة
  filterNotifications();
});

// وظيفة إسناد المهمة
function assignTask(taskTitle) {
  // توجيه المستخدم إلى صفحة المشرف مع تمرير عنوان المهمة
  window.location.href = `supervisor-dashboard.html?task=${encodeURIComponent(taskTitle)}`;
}

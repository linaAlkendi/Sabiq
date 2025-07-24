document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  const menu = document.getElementById("menu");

  if (!role) return; // لا شيء يظهر إذا لم يتم تسجيل الدخول

  let items = [];

  if (role === "فني") {
    items = [
      { name: "مهامي", link: "technician-dashboard.html" },
      { name: "الإعدادات", link: "settings.html" }
    ];
  } else if (role === "مشرف صيانة") {
    items = [
      { name: "لوحة التحكم", link: "supervisor-dashboard.html" },
      { name: "البلاغات", link: "reports.html" },
      { name: "سجل الأعطال", link: "detailed-log.html" },
      { name: "مؤشر الفنيين", link: "performance.html" },
      { name: "التنبيهات", link: "notifications.html" },
      { name: "الإعدادات", link: "settings.html" }
    ];
  } else if (role === "مدير عمليات") {
    items = [
      { name: "لوحة التحكم", link: "dashboard.html" },
      { name: "البلاغات", link: "reports.html.html" },
      { name: "سجل الأعطال", link: "detailed-log.html" },
      { name: "التنبيهات", link: "notifications.html" },
      { name: "الإعدادات", link: "settings.html" }
    ];
  }

  items.forEach(item => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.link;
    a.textContent = item.name;
    li.appendChild(a);
    menu.appendChild(li);
  });
});

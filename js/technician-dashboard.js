document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("taskContainer");

  const tasks = [
    {
      title: "فحص مصعد A",
      type: "ميكانيكي",
      status: "قيد التنفيذ",
      priority: "متوسطة",
      facilityStatusAtAssign: "شغال",
      date: "2025-07-12"
    },
    {
      title: "إصلاح السلم الكهربائي 3",
      type: "كهربائي",
      status: "قيد التنفيذ",
      priority: "عالية",
      facilityStatusAtAssign: "معطل",
      date: "2025-07-11"
    },
    {
      title: "فحص بوابة 5",
      type: "كهربائي",
      status: "بانتظار التنفيذ",
      priority: "منخفضة",
      facilityStatusAtAssign: "شغال",
      date: "2025-07-10"
    },
    {
      title: "استبدال مصباح الإنارة",
      type: "كهربائي",
      status: "بانتظار الموافقة",
      priority: "متوسطة",
      facilityStatusAtAssign: "شغال",
      date: "2025-07-09"
    },
    {
      title: "إصلاح نظام التكييف",
      facility: "المبنى A",
      type: "ميكانيكي",
      status: "تم الإنجاز",
      priority: "عالية",
      facilityStatusAtAssign: "معطل",
      date: "2025-07-05"
    }
  ];

  const progressMap = {
    "قيد التنفيذ": 50,
    "بانتظار التنفيذ": 0,
    "بانتظار الموافقة": 20,
    "تم الإنجاز": 100,
  };

  const statusIcons = {
    "قيد التنفيذ": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    "بانتظار التنفيذ": `<svg viewBox="0 0 24 24"><path d="M3 12l18 0" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    "بانتظار الموافقة": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/><path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
    "تم الإنجاز": `<svg viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="2" fill="none"/></svg>`,
  };

  const priorityIcons = {
    "عالية": `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="10" fill="#d32f2f"/>
        <text x="12" y="16" text-anchor="middle" fill="white" font-size="14" font-family="Arial">!</text>
      </svg>`,
    "متوسطة": `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <polygon points="12,2 22,20 2,20" fill="#f57c00"/>
        <text x="12" y="17" text-anchor="middle" fill="white" font-size="14" font-family="Arial">!</text>
      </svg>`,
    "منخفضة": `
      <svg viewBox="0 0 24 24" width="20" height="20">
        <circle cx="12" cy="12" r="10" fill="#388e3c"/>
        <text x="12" y="16" text-anchor="middle" fill="white" font-size="14" font-family="Arial">✓</text>
      </svg>`
  };

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "card-content";

    const assignedDate = new Date(task.date);
    const now = new Date();
    const diffDays = Math.floor((now - assignedDate) / (1000 * 60 * 60 * 24));

    const statusKey = task.status.trim().replace(/\s+/g, "-");
    const progress = progressMap[task.status.trim()] || 0;
    const iconSVG = statusIcons[task.status.trim()] || "";
    const priorityBadge = task.priority ? `
      <div class="priority-badge ${task.priority}">
        ${priorityIcons[task.priority] || ""}
        <span>${task.priority}</span>
      </div>` : "";

    let timingMessage = "";
    if (task.status.trim() === "تم الإنجاز") {
      timingMessage = `<div class="task-info completion-info">تم الإنجاز خلال ${diffDays} يوم منذ الإسناد</div>`;
    } else {
      timingMessage = `<div class="task-info completion-info">مر ${diffDays} يوم منذ الإسناد</div>`;
    }

    const facilityStatus = task.facilityStatusAtAssign ? `
      <div class="task-info">حالة المرفق وقت الإسناد: ${task.facilityStatusAtAssign}</div>
    ` : "";

    contentWrapper.innerHTML = `
      ${priorityBadge}
      <div class="task-title">${task.title}</div>
      <div class="task-info">النوع: ${task.type}</div>
      <div class="task-info">تاريخ الإسناد: ${task.date}</div>
      ${facilityStatus}
      ${timingMessage}
      <div class="status-badge status-${statusKey}">
        ${iconSVG}
        <span>${task.status}</span>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${progress}%;"></div>
      </div>
    `;

    card.appendChild(contentWrapper);

    if (["قيد التنفيذ", "بانتظار الموافقة"].includes(task.status)) {
      card.classList.add("has-overlay");

      const completeBtn = document.createElement("div");
      completeBtn.className = "complete-overlay";
      completeBtn.textContent = "توثيق إنهاء المهمة";

      completeBtn.addEventListener("click", e => {
        e.stopPropagation();
        alert(`توثيق إنهاء المهمة: ${task.title}`);
      });

      card.appendChild(completeBtn);

      card.addEventListener("click", () => {
        window.location.href = "complete-task.html";
      });
    }

    taskContainer.appendChild(card);
  });
});

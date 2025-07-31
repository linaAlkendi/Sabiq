document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("taskContainer");
  const qrButton = document.getElementById('qrButton');

  const username = localStorage.getItem("username");

  if (!username || !taskContainer) {
    console.error("Missing username or task container.");
    return;
  }

  fetch(`http://localhost:3000/api/tasks/user/${username}`)
    .then(response => response.json())
    .then(tasks => {

      // Demo tasks for UI showcasing
      const demoTasks = [
        {
          id: -1,
          action: "فحص المصعد",
          fault: "ميكانيكي",
          facility: "مصعد A"  ,
          status: "قيد التنفيذ",
          priority: "متوسطة",
          facilityStatusAtAssign: "شغال",
          assignedDate: "2025-07-12"
        },
        {
          id: -2,
          action: "إصلاح السلم الكهربائي",
          fault: "كهربائي",
          facility: "سلم كهربائي 3" ,
          status: "قيد التنفيذ",
          priority: "عالية",
          facilityStatusAtAssign: "معطل",
          assignedDate: "2025-07-11"
        },
        {
          id: -3,
          action: "فحص البوابة",
          fault: "كهربائي",
          facility: "بوابة 5",
          status: "بانتظار التنفيذ",
          priority: "منخفضة",
          facilityStatusAtAssign: "شغال",
          assignedDate: "2025-07-10"
        },
        {
          id: -4,
          action: "استبدال مصباح الإنارة",
          fault: "كهربائي",
          facility: "3 مصباح الإنارة",
          status: "بانتظار قطع الغيار",
          priority: "متوسطة",
          facilityStatusAtAssign: "شغال",
          assignedDate: "2025-07-09"
        },
        {
          id: -5,
          action: "إصلاح نظام التكييف",
          fault: "ميكانيكي",
          facility: "جهاز التكييف A",
          status: "تم الإنجاز",
          priority: "عالية",
          facilityStatusAtAssign: "معطل",
          assignedDate: "2025-07-05"
        }
      ];

      // Merge fetched tasks with demo tasks
      tasks = [...tasks, ...demoTasks];


      const progressMap = {
        "قيد التنفيذ": 50,
        "بانتظار التنفيذ": 0,
        "بانتظار قطع الغيار": 20,
        "تم الإنجاز": 100,
      };

      const statusIcons = {
      "قيد التنفيذ": `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
      "بانتظار التنفيذ": `<svg viewBox="0 0 24 24"><path d="M3 12l18 0" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,
  "بانتظار قطع الغيار": `
    <svg viewBox="0 0 24 24" width="24" height="24">
      <!-- رمز مفتاح البراغي -->
      <path d="M12 2L15 5L12 8L15 11L12 14L9 17L6 14L3 11L6 8L9 5L12 2Z" 
            stroke="white" stroke-width="1.5" fill="none"/>
      <!-- رمز الضبط (مفتاح إنجليزي) -->
      <path d="M18 8L22 4M18 16L22 20M6 8L2 4M6 16L2 20" 
            stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <!-- نقطة تمثل القطع -->
      <circle cx="12" cy="11" r="1.5" fill="white"/>
    </svg>`,
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

        const assignedDate = new Date(task.assignedDate);
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
          <div class="task-title">${task.action}</div>
          <div class="task-info">المرفق: ${task.facility}</div>
          <div class="task-info">النوع: ${task.fault}</div>
          <div class="task-info">تاريخ الإسناد: ${task.assignedDate}</div>
          ${timingMessage}
          ${priorityBadge}
          <div class="status-badge status-${statusKey}">
            ${iconSVG}
            <span>${task.status}</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${progress}%;"></div>
          </div>
        `;

        card.appendChild(contentWrapper);

        if (["قيد التنفيذ", "بانتظار قطع الغيار"].includes(task.status)) {
          card.classList.add("has-overlay");

          const completeBtn = document.createElement("div");
          completeBtn.className = "complete-overlay";
          completeBtn.textContent = "توثيق إنهاء المهمة";

          completeBtn.addEventListener("click", e => {
          
              window.location.href = "complete-task.html";
          });


          card.appendChild(completeBtn);

          card.addEventListener("click", () => {
            window.location.href = "complete-task.html";
          });
        }

        taskContainer.appendChild(card);
      });
      updateStats(tasks)
    })
    .catch(error => {
      console.error("خطأ في جلب المهام:", error);
      taskContainer.innerHTML = `<p class="error-msg">تعذر تحميل المهام، حاول مرة أخرى لاحقًا.</p>`;
    });
function updateStats(tasks) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "تم الإنجاز").length;
    const inProgressTasks = tasks.filter(t => t.status === "قيد التنفيذ").length;
    const urgentTasks = tasks.filter(t => t.priority === "عالية").length;

    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${totalTasks}</div>
        <div class="stat-label">إجمالي المهام</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${completedTasks}</div>
        <div class="stat-label">مهام مكتملة</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${inProgressTasks}</div>
        <div class="stat-label">قيد التنفيذ</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${urgentTasks}</div>
        <div class="stat-label">مهام عاجلة</div>
      </div>
    `;
  }
  qrButton.addEventListener('click', () => {
    window.location.href = 'qr-dashboard.html';
  });
});

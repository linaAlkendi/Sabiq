function openAssignmentModal() {
  document.getElementById("assignmentModalOverlay").style.display = "flex";
}

function closeAssignmentModal() {
  document.getElementById("assignmentModalOverlay").style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => {
  let tasks = [
    { technician: "أحمد القحطاني", facility: "سلم كهربائي 2", fault: "كهربائي", status: "قيد التنفيذ", severity: "وسط", action: "استبدال الأسلاك", assignedDate: "2025-07-10" },
    { technician: "سارة الزهراني", facility: "بوابة إلكترونية", fault: "كهربائي", status: "تم الإنجاز", severity: "خطير", action: "إعادة تشغيل", assignedDate: "2025-07-11" },
    { technician: "خالد العنزي", facility: "مصعد 3", fault: "ميكانيكي", status: "تم الإنجاز", severity: "بسيط", action: "غطاء مكشوف", assignedDate: "2025-07-12" },
    { technician: "محمد العلي", facility: "بوابة إلكترونية 1", fault: "كهربائي", status: "قيد التنفيذ", severity: "وسط", action: "فحص التوصيلات الكهربائية", assignedDate: "2025-07-11" },
    { technician: "ليلى الشمري", facility: "مصعد 5", fault: "ميكانيكي", status: "تم الإنجاز", severity: "خطير", action: "تبديل المحرك", assignedDate: "2025-07-09" },
    { technician: "ريم العتيبي", facility: "مصعد 1", fault: "ميكانيكي", status: "قيد التنفيذ", severity: "خطير", action: "ضبط المحرك", assignedDate: "2025-07-14" },
    { technician: "ناصر الحربي", facility: "سلم كهربائي 5", fault: "كهربائي", status: "تم الإنجاز", severity: "بسيط", action: "فحص النظام", assignedDate: "2025-07-10" },
    { technician: "هالة البلوشي", facility: "مصعد 2", fault: "ميكانيكي", status: "قيد التنفيذ", severity: "وسط", action: "طلب قطع غيار", assignedDate: "2025-07-15" },
    { technician: "سلمان الزهراني", facility: "بوابة إلكترونية 2", fault: "كهربائي", status: "قيد التنفيذ", severity: "وسط", action: "فحص الكابلات", assignedDate: "2025-07-14" }
  ];

  const now = new Date();
  const taskTableWrapper = document.getElementById("taskTableWrapper");
  const activeTechsElem = document.getElementById("activeTechs");
  const ongoingTasksElem = document.getElementById("ongoingTasks");
  const completedTodayElem = document.getElementById("completedToday");

  const statusFilter = document.getElementById("statusFilter");
  const faultFilter = document.getElementById("faultFilter");

  const severityFilter = document.createElement("select");
  severityFilter.id = "severityFilter";
  severityFilter.innerHTML = `
    <option value="all">كل درجات الخطورة</option>
    <option value="خطير">خطير</option>
    <option value="وسط">وسط</option>
    <option value="بسيط">بسيط</option>
  `;
  const filtersWrapper = document.querySelector(".filters-wrapper");
  filtersWrapper.insertBefore(severityFilter, filtersWrapper.children[2]); // ضع فلتر الخطورة قبل حقل البحث

  const searchInput = document.getElementById("searchInput");


  // زر تأكيد المهام المنجزة
  const confirmCompletedWrapper = document.createElement("div");
  confirmCompletedWrapper.style.marginTop = "12px";
  confirmCompletedWrapper.style.textAlign = "center";
  confirmCompletedWrapper.style.display = "none";
  confirmCompletedWrapper.innerHTML = `<button id="confirmCompletedBtn" style="
    background-color: var(--primary-btn);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 10px 20px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  ">تأكيد المهام المحددة</button>`;
  filtersWrapper.appendChild(confirmCompletedWrapper);

  const confirmCompletedBtn = confirmCompletedWrapper.querySelector("#confirmCompletedBtn");

  // نافذة التأكيد المنبثقة
  const confirmPopup = document.getElementById("confirmPopup");
  const confirmMessage = confirmPopup.querySelector(".confirm-message");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  function renderTasks(filteredTasks) {
    if (filteredTasks.length === 0) {
      taskTableWrapper.innerHTML = `<div class="no-tasks-message">لا توجد مهام حالياً.</div>`;
      confirmCompletedWrapper.style.display = "none";
      return;
    }

    confirmCompletedWrapper.style.display = (statusFilter.value === "تم الإنجاز") ? "block" : "none";

    const table = `
      <table class="task-table">
        <thead>
          <tr>
            ${statusFilter.value === "تم الإنجاز" ? "<th>اختيار</th>" : ""}
            <th>الفني</th>
            <th>المرفق</th>
            <th>نوع العطل</th>
            <th>درجة الخطورة</th>
            <th>الحالة</th>
            <th>تاريخ الإسناد</th>
            <th>الإجراء</th>
          </tr>
        </thead>
        <tbody>
          ${filteredTasks.map((task, index) => `
            <tr>
              ${statusFilter.value === "تم الإنجاز" ? `<td><input type="checkbox" class="task-checkbox" data-id="${task.technician}__${task.facility}__${task.assignedDate}"></td>` : ""}
              <td>${task.technician}</td>
              <td>${task.facility}</td>
              <td>${task.fault}</td>
              <td>${task.severity}</td>
              <td><span class="status ${task.status.replace(/\s+/g, "-")}">${task.status}</span></td>
              <td>${task.assignedDate}</td>
              <td>${task.action}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    taskTableWrapper.innerHTML = table;
  }

  function updateStats(tasksToCount) {
    activeTechsElem.textContent = new Set(tasksToCount.map(t => t.technician)).size;
    ongoingTasksElem.textContent = tasksToCount.filter(t => t.status === "قيد التنفيذ").length;
    completedTodayElem.textContent = tasksToCount.filter(t => t.status === "تم الإنجاز").length;
  }

  function filterTasks() {
    const statusVal = statusFilter.value;
    const faultVal = faultFilter.value;
    const severityVal = severityFilter.value;
    const searchVal = searchInput.value.toLowerCase().trim();

    let filtered = tasks.filter(task => {
      const isLate = statusVal === "late" && isTaskLate(task.assignedDate);
      const matchesStatus = statusVal === "all" || task.status === statusVal || isLate;
      const matchesFault = faultVal === "all" || task.fault === faultVal;
      const matchesSeverity = severityVal === "all" || task.severity === severityVal;
      const matchesSearch = task.technician.toLowerCase().includes(searchVal) || task.facility.toLowerCase().includes(searchVal);
      return matchesStatus && matchesFault && matchesSeverity && matchesSearch;
    });

    renderTasks(filtered);
    updateStats(filtered);
  }

  function isTaskLate(dateStr) {
    const assigned = new Date(dateStr);
    const diffHours = (now - assigned) / 36e5;
    return diffHours > 24;
  }

  statusFilter.addEventListener("change", () => {
    filterTasks();
  });

  faultFilter.addEventListener("change", filterTasks);
  severityFilter.addEventListener("change", filterTasks);
  searchInput.addEventListener("input", filterTasks);


document.getElementById("assignmentForm").addEventListener("submit", function (e) {
  e.preventDefault();
  //    المعالجة  ( إرسال البيانات للسيرفر)
  closeAssignmentModal();
  alert("تم إسناد العطل بنجاح!");
});


  // نافذة التنبيه (في حال لم يتم اختيار أي مهمة)
  function showAlertMessage(msg) {
    confirmMessage.textContent = msg;
    confirmYes.style.display = "none";
    confirmNo.style.display = "none";
    confirmPopup.style.display = "flex";

    setTimeout(() => {
      confirmPopup.style.display = "none";
      confirmYes.style.display = "inline-block";
      confirmNo.style.display = "inline-block";
    }, 2500);
  }

  confirmCompletedBtn.addEventListener("click", () => {
    const checkboxes = taskTableWrapper.querySelectorAll(".task-checkbox:checked");
    if (checkboxes.length === 0) {
      showAlertMessage("يجب تحديد مهمة واحدة على الأقل");
      return;
    }

    confirmMessage.textContent = "هل تريد تأكيد جميع المهام المحددة؟";
    confirmPopup.style.display = "flex";
  });

  confirmYes.addEventListener("click", () => {
    const checkboxes = taskTableWrapper.querySelectorAll(".task-checkbox:checked");
    const idsToDelete = Array.from(checkboxes).map(chk => chk.dataset.id);

    tasks = tasks.filter(task => {
      const taskId = `${task.technician}__${task.facility}__${task.assignedDate}`;
      return !idsToDelete.includes(taskId);
    });

    confirmPopup.style.display = "none";
    showAlertMessage("تم التأكيد");

    filterTasks();

    if (tasks.filter(t => t.status === "تم الإنجاز").length === 0) {
      taskTableWrapper.innerHTML = `<div class="no-tasks-message">لا توجد مهام حالياً.</div>`;
      confirmCompletedWrapper.style.display = "none";
    }
  });

  confirmNo.addEventListener("click", () => {
    confirmPopup.style.display = "none";
  });



  filterTasks();
});

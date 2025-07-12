document.addEventListener("DOMContentLoaded", () => {
  let tasks = [
    {
      technician: "أحمد القحطاني",
      facility: "سلم كهربائي 2",
      fault: "كهربائي",
      status: "قيد التنفيذ",
      action: "استبدال اللوحة",
      assignedDate: "2025-07-10"
    },
    {
      technician: "سارة الزهراني",
      facility: "بوابة إلكترونية",
      fault: "كهربائي",
      status: "تم الإنجاز",
      action: "إعادة تشغيل",
      assignedDate: "2025-07-11"
    },
    {
      technician: "خالد العنزي",
      facility: "مصعد 3",
      fault: "ميكانيكي",
      status: "بانتظار التوجيه",
      action: "في انتظار الموافقة",
      assignedDate: "2025-07-12"
    },
    {
      technician: "محمد العلي",
      facility: "بوابة إلكترونية 1",
      fault: "كهربائي",
      status: "قيد التنفيذ",
      action: "فحص التوصيلات الكهربائية",
      assignedDate: "2025-07-11"
    },
    {
      technician: "ليلى الشمري",
      facility: "مصعد 5",
      fault: "ميكانيكي",
      status: "تم الإنجاز",
      action: "تبديل المحرك",
      assignedDate: "2025-07-09"
    }
  ];

  const now = new Date();
  const taskTableWrapper = document.getElementById("taskTableWrapper");
  const activeTechsElem = document.getElementById("activeTechs");
  const ongoingTasksElem = document.getElementById("ongoingTasks");
  const completedTodayElem = document.getElementById("completedToday");

  const statusFilter = document.getElementById("statusFilter");
  const faultFilter = document.getElementById("faultFilter");
  const searchInput = document.getElementById("searchInput");

  const assignModal = document.getElementById("assignModal");
  const assignBtn = document.getElementById("assignBtn");
  const submitAssignment = document.getElementById("submitAssignment");
  const cancelAssignment = document.getElementById("cancelAssignment");

  const technicianInput = document.getElementById("technicianInput");
  const facilityInput = document.getElementById("facilityInput");
  const faultTypeInput = document.getElementById("faultTypeInput");
  const actionInput = document.getElementById("actionInput");

  // عرض المهام في الجدول
  function renderTasks(filteredTasks) {
    if (filteredTasks.length === 0) {
      taskTableWrapper.innerHTML = `<div class="no-tasks-message">لا توجد مهام حالياً.</div>`;
      return;
    }

    const table = `
      <table class="task-table">
        <thead>
          <tr>
            <th>الفني</th>
            <th>المرفق</th>
            <th>نوع العطل</th>
            <th>الحالة</th>
            <th>تاريخ الإسناد</th>
            <th>الإجراء</th>
          </tr>
        </thead>
        <tbody>
          ${filteredTasks.map(task => `
            <tr>
              <td>${task.technician}</td>
              <td>${task.facility}</td>
              <td>${task.fault}</td>
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

  // إحصائيات
  function updateStats(tasks) {
    activeTechsElem.textContent = new Set(tasks.map(t => t.technician)).size;
    ongoingTasksElem.textContent = tasks.filter(t => t.status === "قيد التنفيذ").length;
    completedTodayElem.textContent = tasks.filter(t => t.status === "تم الإنجاز").length;
  }

  // تصفية المهام
  function filterTasks() {
    const statusVal = statusFilter.value;
    const faultVal = faultFilter.value;
    const searchVal = searchInput.value.toLowerCase().trim();

    let filtered = tasks.filter(task => {
      const isLate = statusVal === "late" && isTaskLate(task.assignedDate);
      const matchesStatus = statusVal === "all" || task.status === statusVal || isLate;
      const matchesFault = faultVal === "all" || task.fault === faultVal;
      const matchesSearch = task.technician.toLowerCase().includes(searchVal) || task.facility.toLowerCase().includes(searchVal);
      return matchesStatus && matchesFault && matchesSearch;
    });

    renderTasks(filtered);
    updateStats(filtered);
  }

  // مهمة متأخرة؟ > 24 ساعة
  function isTaskLate(dateStr) {
    const assigned = new Date(dateStr);
    const diffHours = (now - assigned) / 36e5;
    return diffHours > 24;
  }

  // فتح نافذة الإسناد
  assignBtn.addEventListener("click", () => {
    assignModal.style.display = "flex";
  });

  // إغلاق النافذة
  cancelAssignment.addEventListener("click", () => {
    assignModal.style.display = "none";
    clearAssignmentFields();
  });

  // عند الإسناد
  submitAssignment.addEventListener("click", () => {
    const technician = technicianInput.value.trim();
    const facility = facilityInput.value.trim();
    const fault = faultTypeInput.value;
    const action = actionInput.value.trim();

    if (!technician || !facility || !action) {
      alert("جميع الحقول مطلوبة");
      return;
    }

    const newTask = {
      technician,
      facility,
      fault,
      status: "قيد التنفيذ",
      action,
      assignedDate: new Date().toISOString().slice(0, 10)
    };

    tasks.unshift(newTask);
    assignModal.style.display = "none";
    clearAssignmentFields();
    showSuccessToast();
    filterTasks();
  });

  function clearAssignmentFields() {
    technicianInput.value = "";
    facilityInput.value = "";
    faultTypeInput.value = "كهربائي";
    actionInput.value = "";
  }

  function showSuccessToast() {
    const toast = document.getElementById("successToast");
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
    }, 3000);
  }

  // التفاعل مع الفلاتر
  statusFilter.addEventListener("change", filterTasks);
  faultFilter.addEventListener("change", filterTasks);
  searchInput.addEventListener("input", filterTasks);

  // بداية
  filterTasks();
});

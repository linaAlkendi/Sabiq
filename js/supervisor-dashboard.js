function openAssignmentModal() {
  document.getElementById("assignmentModalOverlay").style.display = "flex";
}

function closeAssignmentModal() {
  document.getElementById("assignmentModalOverlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  let tasks = [];

  fetch("https://sabiq-node-backend.onrender.com/api/tasks")
    .then((response) => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return response.json();
    })
    .then((data) => {
      tasks = data;
      filterTasks(); // render the initial view after loading
    })
    .catch((error) => {
      console.error("Failed to load tasks:", error);
      taskTableWrapper.innerHTML = `<div class="no-tasks-message">فشل في تحميل المهام.</div>`;
    });

  const now = new Date();
  const taskTableWrapper = document.getElementById("taskTableWrapper");
  const activeTechsElem = document.getElementById("activeTechs");
  const ongoingTasksElem = document.getElementById("ongoingTasks");
  const completedTodayElem = document.getElementById("completedToday");

  const statusFilter = document.getElementById("statusFilter");
  const faultFilter = document.getElementById("faultFilter");
  const dateFilter = document.getElementById("dateFilter");

  const severityFilter = document.createElement("select");
  severityFilter.id = "severityFilter";
  
  severityFilter.innerHTML = `
    <option value="all">كل درجات الخطورة</option>
    <option value="عالية">عالية</option>
    <option value="متوسطة">متوسطة</option>
    <option value="منخفضة">منخفضة</option>
  `;
  const filtersWrapper = document.querySelector(".filters-wrapper");
  filtersWrapper.insertBefore(severityFilter, filtersWrapper.children[2]);

  const searchInput = document.getElementById("searchInput");

  // زر تأكيد المهام المنجزة
  const confirmCompletedWrapper = document.createElement("div");
  confirmCompletedWrapper.style.marginTop = "2px";
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
              <td><span class="status-badge status-capsule status-${task.status.replace(/\s+/g, "-")}">${task.status}</span></td>
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
    const dateFilterVal = dateFilter.value;

    let filtered = tasks.filter(task => {
      const isLate = statusVal === "late" && isTaskLate(task.assignedDate);
      const matchesStatus = statusVal === "all" || task.status === statusVal || isLate;
      const matchesFault = faultVal === "all" || task.fault === faultVal;
      const matchesSeverity = severityVal === "all" || task.severity === severityVal;
      const matchesSearch = task.technician.toLowerCase().includes(searchVal) || 
                           task.facility.toLowerCase().includes(searchVal);
      return matchesStatus && matchesFault && matchesSeverity && matchesSearch;
    });

    // تطبيق فلتر التاريخ
    if (dateFilterVal !== "all") {
      filtered.sort((a, b) => {
        const dateA = new Date(a.assignedDate);
        const dateB = new Date(b.assignedDate);
        return dateFilterVal === "من الأحدث للأقدم" ? 
               dateB - dateA : // من الأحدث للأقدم
               dateA - dateB;  // من الأقدم للأحدث
      });
    }

    renderTasks(filtered);
    updateStats(filtered);
  }

  function isTaskLate(dateStr) {
    try {
      const assigned = new Date(dateStr);
      if (isNaN(assigned)) return false;
      
      const diffHours = (now - assigned) / 36e5;
      return diffHours > 24;
    } catch (e) {
      console.error("Error parsing date:", dateStr, e);
      return false;
    }
  }

  // إضافة مستمعات الأحداث للفلاتر
  statusFilter.addEventListener("change", filterTasks);
  faultFilter.addEventListener("change", filterTasks);
  severityFilter.addEventListener("change", filterTasks);
  dateFilter.addEventListener("change", filterTasks);
  searchInput.addEventListener("input", filterTasks);

  // نافذة التنبيه
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

  // Populate technicians
  fetch("https://sabiq-node-backend.onrender.com/auth/by-role/فني")
    .then(response => response.json())
    .then(data => {
      const technicianSelect = document.getElementById("technicianSelect");
      technicianSelect.innerHTML = `<option value="">اختر الفني</option>`;

      data.forEach(tech => {
        const option = document.createElement("option");
        option.value = tech.fullName || tech.username || tech.name;
        option.textContent = tech.fullName || tech.username || tech.name;
        technicianSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Failed to load technicians:", error);
    });

  // Populate facilities
  fetch("https://sabiq-node-backend.onrender.com/facilities")
    .then(response => response.json())
    .then(data => {
      const facilitySelect = document.getElementById("facilitySelect");
      facilitySelect.innerHTML = `<option value="">اختر المرفق</option>`;

      data.forEach(facility => {
        const option = document.createElement("option");
        option.value = facility.name;
        option.textContent = facility.name;
        facilitySelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Failed to load facilities:", error);
    });

  document.getElementById("assignmentForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const technician = document.getElementById("technicianSelect").value;
    const facility = document.getElementById("facilitySelect").value;
    const fault = document.getElementById("faultTypeSelect").value;
    const severity = document.getElementById("severitySelect").value;
    const action = document.getElementById("actionInput").value.trim();

    if (!technician || !facility || !fault || !severity || !action) {
      alert("يرجى تعبئة جميع الحقول قبل الإرسال.");
      return;
    }

    const payload = {
      technician,
      facility,
      fault,
      severity,
      action
    };

    fetch("https://sabiq-node-backend.onrender.com/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP error " + response.status);
        return response.json();
      })
      .then((result) => {
        alert("✅ تم إسناد المهمة بنجاح!");
        closeAssignmentModal();
        location.reload();
      })
      .catch((error) => {
        console.error("Failed to assign task:", error);
        alert("حدث خطأ أثناء إرسال المهمة. حاول مرة أخرى.");
      });
  });
});
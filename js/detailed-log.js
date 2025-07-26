document.addEventListener("DOMContentLoaded", function () {
  const logsTableBody = document.getElementById("logsTableBody");
  const detailsSection = document.getElementById("detailsSection");
  const actionContent = document.getElementById("actionContent");
  const typeFilter = document.getElementById("typeFilter");
  const facilityTypeFilter = document.getElementById("facilityTypeFilter");
  const sortOrderSelect = document.getElementById("sortOrder");

  const predictedFacilityEl = document.getElementById("predictedFacilitySummary");
  const commonCausesList = document.getElementById("commonCausesList");
  const downtimeSummaryList = document.getElementById("downtimeSummaryList");
  const insightsList = document.getElementById("insightsList");

  let faultDetails = [];
  let tableData = [];

  fetch("https://sabiq-node-backend.onrender.com/api/detailed-log/incidents")
    .then(response => response.json())
    .then(data => {
      tableData = data;
      renderTable();
    })
    .catch(err => {
      console.error("فشل تحميل بيانات الأعطال:", err);
    });

  function renderTable() {
    // ترتيب البيانات حسب الاختيار
    const sortOrder = sortOrderSelect.value;
    const sortedData = [...tableData].sort((a, b) => {
      const dateA = new Date(a["تاريخ العطل"]);
      const dateB = new Date(b["تاريخ العطل"]);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    logsTableBody.innerHTML = "";
    faultDetails = [];

    sortedData.forEach((item, index) => {
      const matchesType =
        typeFilter.value === "all" || item["نوع العطل"] === typeFilter.value;
      const matchesFacility =
        facilityTypeFilter.value === "all" || item["نوع المرفق"] === facilityTypeFilter.value;

      if (matchesType && matchesFacility) {
        const tr = document.createElement("tr");
        tr.setAttribute("data-index", faultDetails.length);

        tr.innerHTML = `
          <td>${item["اسم المرفق"] || "-"}</td>
          <td>${item["نوع المرفق"] || "-"}</td>
          <td>${item["تاريخ العطل"] || "-"}</td>
          <td>${item["نوع العطل"] || "-"}</td>
          <td>${item["مدة التوقف"] || "-"}</td>
          <td>${item["درجة الخطورة"] || "-"}</td>
          <td>${item["سبب المشكلة"] || "-"}</td>
          <td>${item["الإجراء المتخذ"] || "-"}</td>
          <td>${item["اسم الفني"] || "-"}</td>
        `;

        logsTableBody.appendChild(tr);

        faultDetails.push({
          actions: item["تفاصيل"]?.actions || [
            `الإجراء: ${item["الإجراء المتخذ"] || "غير متوفر"}`,
            `تاريخ العطل: ${item["تاريخ العطل"] || "غير معروف"}`
          ],
          pdf: item["تفاصيل"]?.pdf || "../assets/report.pdf",
          facility: item["نوع المرفق"] || "غير معروف"
        });
      }
    });

    setupEventListeners();
    detailsSection.classList.add("hidden");
    updatePrediction();
  }

  function setupEventListeners() {
    const rows = document.querySelectorAll("#logsTable tbody tr");

    rows.forEach(row => {
      row.addEventListener("click", () => {
        const index = row.getAttribute("data-index");
        const details = faultDetails[index];

        actionContent.innerHTML = details.actions
          .map(line => `<p>${line}</p>`)
          .join("");

        const pdfLinks = document.querySelectorAll("#detailsSection .pdf-link");
        pdfLinks.forEach(link => {
          link.href = details.pdf;
        });

        detailsSection.classList.remove("hidden");
        detailsSection.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  typeFilter.addEventListener("change", renderTable);
  facilityTypeFilter.addEventListener("change", renderTable);
  sortOrderSelect.addEventListener("change", renderTable);

  
  function updatePrediction() {
    // سيتم تحديثه لاحقًا عند الحاجة
  }

  fetch("https://sabiq-node-backend.onrender.com/api/detailed-log/output")
    .then(res => res.json())
    .then(result => {
      predictedFacilityEl.textContent = result.prediction || 'غير معروف';

      commonCausesList.innerHTML = Object.entries(result.common_causes || {})
        .map(([cause, count]) => `<li>${cause} (${count} حالة)</li>`)
        .join('') || "<li>لا توجد بيانات</li>";

      downtimeSummaryList.innerHTML = Object.entries(result.summary || {})
        .map(([faultType, avg]) => `<li>${faultType}: ${avg} دقيقة</li>`)
        .join('') || "<li>لا توجد بيانات</li>";

      insightsList.innerHTML = (result.insights || [])
        .map(insight => `<li>${insight}</li>`)
        .join('') || "<li>لا توجد بيانات</li>";
    })
    .catch(err => {
      console.error("فشل تحميل بيانات التنبؤ:", err);
      predictedFacilityEl.textContent = "خطأ في تحميل التنبؤ";
    });
});

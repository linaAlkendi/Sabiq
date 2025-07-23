document.addEventListener("DOMContentLoaded", function () {
  const logsTableBody = document.getElementById("logsTableBody");
  const detailsSection = document.getElementById("detailsSection");
  const actionContent = document.getElementById("actionContent");
  const typeFilter = document.getElementById("typeFilter");
  const facilityTypeFilter = document.getElementById("facilityTypeFilter");

  // عناصر عرض التنبؤ والتحليل
  const predictedFacilityEl = document.getElementById("predictedFacilitySummary");
  const commonCausesList = document.getElementById("commonCausesList");
  const downtimeSummaryList = document.getElementById("downtimeSummaryList");
  const insightsList = document.getElementById("insightsList");

  let faultDetails = []; // بيانات الإجراءات لكل سجل

  // تحميل بيانات الأعطال من JSON
  fetch("../backend/data/incidentData.json")
    .then(response => response.json())
    .then(data => {
      // بناء الجدول
      data.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.setAttribute("data-index", index);

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
      });

      // تجهيز بيانات الإجراءات والروابط لكل سجل
      faultDetails = data.map(item => ({
        actions: item["تفاصيل"]?.actions || [
          `الإجراء: ${item["الإجراء المتخذ"] || "غير متوفر"}`,
          `تاريخ العطل: ${item["تاريخ العطل"] || "غير معروف"}`
        ],
        pdf: item["تفاصيل"]?.pdf || "../assets/report.pdf",
        facility: item["نوع المرفق"] || "غير معروف"
      }));

      setupEventListeners();
      filterTable(); // تطبيق الفلترة الافتراضية
    })
    .catch(err => {
      console.error("فشل تحميل بيانات الأعطال:", err);
    });

  // إضافة أحداث النقر على الصفوف لعرض التفاصيل
  function setupEventListeners() {
    const rows = document.querySelectorAll("#logsTable tbody tr");

    rows.forEach(row => {
      row.addEventListener("click", () => {
        const index = row.getAttribute("data-index");
        const details = faultDetails[index];

        actionContent.innerHTML = details.actions
          .map(line => `<p>${line}</p>`)
          .join("");

        // تحديث روابط PDF داخل قسم التفاصيل
        const pdfLinks = document.querySelectorAll("#detailsSection .pdf-link");
        pdfLinks.forEach(link => {
          link.href = details.pdf;
        });

        detailsSection.classList.remove("hidden");
        detailsSection.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  // فلترة الجدول حسب نوع العطل ونوع المرفق
  function filterTable() {
    const selectedType = typeFilter.value;
    const selectedFacilityType = facilityTypeFilter.value;

    const rows = document.querySelectorAll("#logsTable tbody tr");

    rows.forEach(row => {
      const faultType = row.children[3].textContent.trim(); // نوع العطل
      const facilityType = row.children[1].textContent.trim(); // نوع المرفق

      const matchesType = selectedType === "all" || faultType === selectedType;
      const matchesFacility = selectedFacilityType === "all" || facilityType === selectedFacilityType;

      if (matchesType && matchesFacility) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });

    detailsSection.classList.add("hidden");
    updatePrediction();
  }

  typeFilter.addEventListener("change", filterTable);
  facilityTypeFilter.addEventListener("change", filterTable);

  // تحديث التنبؤ الذكي من بيانات الصفوف المرئية (يمكن التعديل لاحقاً)
  function updatePrediction() {
    // هنا يمكن ربط تحديث التنبؤ مع الفلاتر أو الاكتفاء ببيانات output.json
  }

  // تحميل ملف التنبؤ والإحصائيات وعرضها في القسم المخصص
  fetch('../backend/data/output.json')
    .then(res => res.json())
    .then(result => {
      // تحديث المرفق المتوقع
      predictedFacilityEl.textContent = result.prediction || 'غير معروف';

      // تحديث قائمة الأسباب الشائعة
      commonCausesList.innerHTML = Object.entries(result.common_causes || {})
        .map(([cause, count]) => `<li>${cause} (${count} حالة)</li>`)
        .join('') || "<li>لا توجد بيانات</li>";

      // تحديث ملخص متوسط مدة التوقف
      downtimeSummaryList.innerHTML = Object.entries(result.summary || {})
        .map(([faultType, avg]) => `<li>${faultType}: ${avg} دقيقة</li>`)
        .join('') || "<li>لا توجد بيانات</li>";

      // تحديث النصائح والتحليلات
      insightsList.innerHTML = (result.insights || [])
        .map(insight => `<li>${insight}</li>`)
        .join('') || "<li>لا توجد بيانات</li>";
    })
    .catch(err => {
      console.error("فشل تحميل بيانات التنبؤ:", err);
      predictedFacilityEl.textContent = "خطأ في تحميل التنبؤ";
    });
});

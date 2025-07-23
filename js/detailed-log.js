document.addEventListener("DOMContentLoaded", function () {
  const logsTableBody = document.getElementById("logsTableBody");
  const detailsSection = document.getElementById("detailsSection");
  const actionContent = document.getElementById("actionContent");
  const typeFilter = document.getElementById("typeFilter");
  const facilityTypeFilter = document.getElementById("facilityTypeFilter");
  const predictedFacilityEl = document.getElementById("predictedFacility");
  const predictiveAlert = document.getElementById("predictiveAlert");

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
          <td>${item["اسم المرفق"]}</td>
          <td>${item["نوع المرفق"]}</td>
          <td>${item["تاريخ العطل"]}</td>
          <td>${item["نوع العطل"]}</td>
          <td>${item["مدة التوقف"]}</td>
          <td>${item["درجة الخطورة"]}</td>
          <td>${item["سبب المشكلة"]}</td>
          <td>${item["الإجراء المتخذ"]}</td>
          <td>${item["اسم الفني"]}</td>
        `;

        logsTableBody.appendChild(tr);
      });

      // تجهيز بيانات الإجراءات والروابط لكل سجل
      faultDetails = data.map(item => ({
        actions: item["تفاصيل"]?.actions || [
          `الإجراء: ${item["الإجراء المتخذ"]}`,
          `تاريخ العطل: ${item["تاريخ العطل"]}`
        ],
        pdf: item["تفاصيل"]?.pdf || "../files/report.pdf",
        facility: item["نوع المرفق"]
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

  // تحديث التنبؤ الذكي: المرفق الأكثر تكرارًا بين الصفوف الظاهرة
  function updatePrediction() {
    const rows = document.querySelectorAll("#logsTable tbody tr");
    const visibleRows = Array.from(rows).filter(row => row.style.display !== "none");
    const facilityCount = {};

    visibleRows.forEach(row => {
      const facility = row.children[1].textContent.trim(); // نوع المرفق
      facilityCount[facility] = (facilityCount[facility] || 0) + 1;
    });

    const sorted = Object.entries(facilityCount).sort((a, b) => b[1] - a[1]);
    const mostLikelyFacility = sorted.length > 0 ? sorted[0][0] : null;

    if (mostLikelyFacility) {
      predictedFacilityEl.textContent = mostLikelyFacility;
      predictiveAlert.style.display = "block";
    } else {
      predictiveAlert.style.display = "none";
      predictedFacilityEl.textContent = "";
    }
  }

  // تحميل ملف التنبؤ والإحصائيات وعرضها في القسم المخصص
  fetch('../backend/data/output.json')
    .then(res => res.json())
    .then(result => {
      // تحديث التنبؤ في التنبيه وملخص التنبؤ
      predictedFacilityEl.textContent = result.prediction;
      document.getElementById('predictedFacilitySummary').textContent = result.prediction;
      predictiveAlert.style.display = 'block';

      // تحديث قائمة متوسط مدة التوقف لكل نوع عطل
      const listEl = document.getElementById('downtimeSummaryList');
      listEl.innerHTML = Object.entries(result.summary)
        .map(([faultType, avg]) => `<li>${faultType}: ${avg} دقيقة</li>`)
        .join('');
    })
    .catch(err => {
      console.error('خطأ في جلب نتائج التنبؤ:', err);
    });

});

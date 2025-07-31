document.addEventListener("DOMContentLoaded", function () {
  const logsTableBody = document.getElementById("logsTableBody");
  const detailsSection = document.getElementById("detailsSection");
  const actionContent = document.getElementById("actionContent");
  const typeFilter = document.getElementById("typeFilter");
  const facilityTypeFilter = document.getElementById("facilityTypeFilter");
  const sortOrderSelect = document.getElementById("sortOrder");

  let faultDetails = [];
  let tableData = [];

  fetch("http://localhost:3000/api/detailed-log/incidents")
    .then(response => response.json())
    .then(data => {
      tableData = data;
      renderTable();
    })
    .catch(err => {
      console.error("فشل تحميل بيانات الأعطال:", err);
    });

  function renderTable() {
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
          imageAfter: item["تفاصيل"]?.after || "../assets/imageAfter.jpg",
          imageBefore: item["تفاصيل"]?.before || "../assets/imageBefore.jpg",
          facility: item["نوع المرفق"] || "غير معروف"
        });
      }
    });

    setupEventListeners();
    detailsSection.classList.add("hidden");
  }

  function setupEventListeners() {
    const rows = document.querySelectorAll("#logsTable tbody tr");

    rows.forEach(row => {
      row.addEventListener("click", () => {
        const index = row.getAttribute("data-index");
        const details = faultDetails[index];

        // عرض الإجراءات
        actionContent.innerHTML = details.actions
          .map(line => `<p>${line}</p>`)
          .join("");

        // تحديث روابط المرفقات
        const attachmentsDiv = document.querySelector("#detailsSection .attachments");
        attachmentsDiv.innerHTML = `
          <div class="attachment"><a href="${details.imageBefore}" target="_blank" class="pdf-link">📸 صورة قبل الإصلاح</a></div>
          <div class="attachment"><a href="${details.imageAfter}" target="_blank" class="pdf-link">📸 صورة بعد الإصلاح</a></div>
          <div class="attachment"><a href="${details.pdf}" target="_blank" class="pdf-link">📄 تقرير صيانة PDF</a></div>
        `;

        // عرض القسم والتمرير إليه
        detailsSection.classList.remove("hidden");
        detailsSection.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  typeFilter.addEventListener("change", renderTable);
  facilityTypeFilter.addEventListener("change", renderTable);
  sortOrderSelect.addEventListener("change", renderTable);

  // عرض بيانات التحليل والتنبؤ
  function displayPredictions(data) {
    if (!data.predictions || data.predictions.length === 0) return;

    const topPred = data.top_prediction;
    document.getElementById('predictedFacility').textContent = topPred.facility || 'غير معروف';
    document.getElementById('predictedProbability').textContent = topPred.probability || '0.0%';
    document.getElementById('predictedDate').textContent = topPred.next_predicted_date || 'غير محدد';

    const facilityAnalysis = data.facility_analysis?.[topPred.facility] || {};

    const causesList = document.getElementById('commonCausesList');
    causesList.innerHTML = Object.entries(facilityAnalysis.common_causes || {})
      .map(([cause, count]) => `<li>${cause} (${count} مرات)</li>`)
      .join('') || "<li>لا توجد بيانات</li>";

    const downtimeList = document.getElementById('downtimeSummaryList');
    downtimeList.innerHTML = Object.entries(data.fault_type_analysis || {})
      .map(([type, stats]) => `<li>${type}: ${stats.avg_downtime.toFixed(1)} دقيقة</li>`)
      .join('') || "<li>لا توجد بيانات</li>";

    const insightsList = document.getElementById('insightsList');
    insightsList.innerHTML = (facilityAnalysis.insights || data.overall_insights || [])
      .map(insight => `<li>${insight}</li>`)
      .join('') || "<li>لا توجد بيانات</li>";

    if (data.trend_analysis) {
      document.getElementById('trendText').textContent =
        `اتجاه الأعطال: ${data.trend_analysis.trend} (${(data.trend_analysis.slope.toFixed(2))*100}%)`;
      renderTrendChart(data.trend_analysis);
    }
  }

  function renderTrendChart(trendData) {
    if (!trendData || !window.Chart) return;

    const ctx = document.getElementById('trendChart').getContext('2d');
    const isDarkMode = document.body.classList.contains("dark");

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['مايو', 'يونيو', 'يوليو'],
        datasets: [{
          label: 'عدد الأعطال',
          data: trendData.last_3_months,
          borderColor: isDarkMode ? 'rgb(75, 192, 192)' : 'rgba(75, 139, 192, 1)',
          backgroundColor: isDarkMode ? 'rgba(75, 192, 192, 0.2)' : 'rgba(75, 143, 192, 0.2)',
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: isDarkMode ? 'rgba(111, 247, 247, 1)' : 'rgba(75, 98, 192, 1)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'اتجاه عدد الأعطال خلال آخر ٣ أشهر',
            font: {
              size: 14
            }
          },
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'عدد الأعطال'
            }
          },
          x: {
            title: {
              display: true,
              text: 'الشهر'
            }
          }
        }
      }
    });

  }

  // تحميل بيانات التنبؤ والتحليل
  fetch("http://localhost:3000/api/detailed-log/output")
    .then(res => res.json())
    .then(displayPredictions)
    .catch(err => {
      console.error("فشل تحميل بيانات التنبؤ:", err);
      document.getElementById('predictedFacility').textContent = "خطأ في تحميل التنبؤ";
    });
});

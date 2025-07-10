document.addEventListener("DOMContentLoaded", () => {
  const facilityFilter = document.getElementById("facilityFilter");
  const yearFilter = document.getElementById("yearFilter");
  const analysisBox = document.getElementById("analysisBox");
  const analysisText = document.getElementById("analysisText");
  const reportBtn = document.getElementById("reportBtn");
  const summaryTableSection = document.getElementById("summaryTableSection");
  const summaryTableBody = document.getElementById("summaryTableBody");
  const tableActions = document.getElementById("tableActions");
  const exportExcelBtn = document.getElementById("exportExcelBtn");
  const exportPdfBtn = document.getElementById("exportPdfBtn");
  const detailedDataBtn = document.getElementById("detailedDataBtn");
  const detailedTableSection = document.getElementById("detailedTableSection");
  const detailedTableBody = document.getElementById("detailedTableBody");

  const ctx = document.getElementById("faultChart").getContext("2d");

  // البيانات التجريبية - استبدليها ببياناتك الحقيقية أو جلبها من API
  const rawData = [
    {
      id: 1,
      type: "escalator",
      name: "سلم كهربائي 1",
      faults: [
        { date: "2024-06-10", faultType: "كهربائي", technician: "محمد" },
        { date: "2024-06-25", faultType: "ميكانيكي", technician: "علي" },
        { date: "2024-07-02", faultType: "كهربائي", technician: "أحمد" },
      ],
    },
    {
      id: 2,
      type: "gate",
      name: "بوابة إلكترونية 3",
      faults: [
        { date: "2024-01-14", faultType: "ميكانيكي", technician: "سارة" },
        { date: "2024-03-21", faultType: "كهربائي", technician: "خالد" },
        { date: "2024-06-10", faultType: "كهربائي", technician: "مريم" },
      ],
    },
    {
      id: 3,
      type: "elevator",
      name: "مصعد 5",
      faults: [
        { date: "2024-06-08", faultType: "كهربائي", technician: "خالد" },
        { date: "2024-07-09", faultType: "ميكانيكي", technician: "علي" },
        { date: "2024-06-20", faultType: "كهربائي", technician: "محمد" },
      ],
    },
  ];

  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  // ملء قائمة السنوات (حسب بيانات rawData)
  function fillYearFilter() {
    const years = new Set();
    rawData.forEach((facility) => {
      facility.faults.forEach((fault) => {
        years.add(new Date(fault.date).getFullYear());
      });
    });
    const sortedYears = Array.from(years).sort();
    sortedYears.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    });
  }

  // فلترة البيانات حسب نوع المرفق والسنة
  function filterData(facilityType, year) {
    return rawData
      .filter((f) => facilityType === "all" || f.type === facilityType)
      .map((f) => ({
        ...f,
        faults: f.faults.filter(
          (fault) => new Date(fault.date).getFullYear() === +year
        ),
      }))
      .filter((f) => f.faults.length > 0);
  }

  // حساب الأعطال الشهرية
  function getMonthlyFaultCounts(filteredData) {
    const counts = new Array(12).fill(0);
    filteredData.forEach((facility) => {
      facility.faults.forEach((fault) => {
        const month = new Date(fault.date).getMonth();
        counts[month]++;
      });
    });
    return counts;
  }

  // إيجاد الشهر الذي به أكبر عدد أعطال
  function getMaxFaultMonth(monthCounts) {
    let maxCount = 0;
    let maxMonthIndex = 0;
    monthCounts.forEach((count, i) => {
      if (count > maxCount) {
        maxCount = count;
        maxMonthIndex = i;
      }
    });
    return { maxMonthIndex, maxCount };
  }

  // إيجاد نوع العطل الأكثر شيوعاً
  function getMostCommonFaultType(filteredData) {
    const faultTypeCounts = {};
    filteredData.forEach((facility) => {
      facility.faults.forEach((fault) => {
        faultTypeCounts[fault.faultType] =
          (faultTypeCounts[fault.faultType] || 0) + 1;
      });
    });
    let maxCount = 0;
    let maxType = null;
    for (const [type, count] of Object.entries(faultTypeCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxType = type;
      }
    }
    return { maxType, maxCount };
  }

  // تحديث جدول ملخص الأعطال الشهري
  function updateMonthlySummaryTable(monthCounts) {
    summaryTableBody.innerHTML = "";
    months.forEach((monthName, index) => {
      summaryTableBody.innerHTML += `
      <tr>
        <td>${monthName}</td>
        <td>${monthCounts[index]}</td>
      </tr>`;
    });
    summaryTableSection.style.display = "block";
  }

  // رسم الرسم البياني
  let faultChart = null;
  function updateChart(filteredData, year) {
    const monthCounts = getMonthlyFaultCounts(filteredData);

    if (faultChart) {
      faultChart.destroy();
    }
    faultChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: `عدد مرات العطل في ${year}`,
            data: monthCounts,
            backgroundColor: "#007bff",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            stepSize: 1,
            ticks: {
              precision: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              font: { size: 16 },
              color: "#0c1f4a",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });
  }

  // تحديث التنبيه الذكي
  function updateSmartAlert(facilityType, filteredData, monthCounts) {
    if (facilityType === "all") {
      // التنبيه عن الشهر الأكثر أعطال
      const { maxMonthIndex, maxCount } = getMaxFaultMonth(monthCounts);
      analysisText.textContent = `⚠️ أكثر شهر فيه أعطال هو ${months[maxMonthIndex]} وعدد الأعطال فيه ${maxCount}.`;
      analysisBox.style.display = "flex";
      reportBtn.style.display = "none";
      detailedDataBtn.style.display = "none";
      detailedTableSection.style.display = "none";
      tableActions.style.display = "none";
    } else {
      // التنبيه عن الشهر الأكثر أعطال ونوع العطل الأكثر شيوعاً
      const { maxMonthIndex, maxCount } = getMaxFaultMonth(monthCounts);
      const { maxType } = getMostCommonFaultType(filteredData);
      analysisText.textContent = `⚠️ أكثر فترة تخريب في ${months[maxMonthIndex]} (${maxCount} أعطال). نوع العطل الأكثر هو: ${maxType}.`;
      analysisBox.style.display = "flex";
      reportBtn.style.display = "none";
      detailedDataBtn.style.display = "inline-block";
      detailedTableSection.style.display = "none";
      tableActions.style.display = "none";
    }
  }

  // عرض الجدول التفصيلي
  function showDetailedData(filteredData) {
    detailedTableBody.innerHTML = "";
    filteredData.forEach((facility) => {
      facility.faults.forEach((fault) => {
        detailedTableBody.innerHTML += `
        <tr>
          <td>${facility.name}</td>
          <td>${fault.date}</td>
          <td>${fault.faultType}</td>
          <td>${fault.technician}</td>
        </tr>`;
      });
    });
    detailedTableSection.style.display = "block";
    tableActions.style.display = "flex";
  }

  // عند اختيار الفلتر
  function onFilterChange() {
    const selectedFacility = facilityFilter.value;
    const selectedYear = +yearFilter.value;
    const filteredData = filterData(selectedFacility, selectedYear);
    const monthCounts = getMonthlyFaultCounts(filteredData);

    updateChart(filteredData, selectedYear);

    if (selectedFacility === "all") {
      updateMonthlySummaryTable(monthCounts);
      analysisBox.style.display = "flex";
      detailedDataBtn.style.display = "none";
      detailedTableSection.style.display = "none";
      tableActions.style.display = "none";
      updateSmartAlert(selectedFacility, filteredData, monthCounts);
    } else {
      updateMonthlySummaryTable(monthCounts);
      updateSmartAlert(selectedFacility, filteredData, monthCounts);
      detailedDataBtn.style.display = "inline-block";
  detailedTableSection.style.display = "none";
  tableActions.style.display = "flex"; 

    }
  }

  // تصدير Excel باستخدام SheetJS
  function exportTableToExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(detailedTableSection.querySelector("table"));
    XLSX.utils.book_append_sheet(wb, ws, "تفاصيل الأعطال");
    XLSX.writeFile(wb, "تفاصيل_الأعطال.xlsx");
  }

  // تصدير PDF باستخدام jsPDF
  function exportTableToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("تفاصيل الأعطال", 40, 40);
    doc.autoTable({ html: detailedTableSection.querySelector("table"), startY: 60 });
    doc.save("تفاصيل_الأعطال.pdf");
  }

  // أحداث أزرار التصدير
  exportExcelBtn.addEventListener("click", () => {
    if (detailedTableSection.style.display === "block") {
      exportTableToExcel();
    }
  });

  exportPdfBtn.addEventListener("click", () => {
    if (detailedTableSection.style.display === "block") {
      exportTableToPDF();
    }
  });

  // عند الضغط على بيانات مفصلة
  detailedDataBtn.addEventListener("click", () => {
    const selectedFacility = facilityFilter.value;
    const selectedYear = +yearFilter.value;
    const filteredData = filterData(selectedFacility, selectedYear);
    showDetailedData(filteredData);
  });

  // تهيئة الصفحة
  fillYearFilter();
  // اختر أول سنة تلقائيًا
  if (yearFilter.options.length > 0) {
    yearFilter.value = yearFilter.options[yearFilter.options.length - 1].value;
  }

  facilityFilter.addEventListener("change", onFilterChange);
  yearFilter.addEventListener("change", onFilterChange);

  onFilterChange();
});

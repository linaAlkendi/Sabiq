document.addEventListener("DOMContentLoaded", () => {
  const yearFilter = document.getElementById("yearFilter");
  const analysisBox = document.getElementById("analysisBox");
  const analysisText = document.getElementById("analysisText");
  const reportBtn = document.getElementById("reportBtn");
  const summaryTableSection = document.getElementById("summaryTableSection");
  const summaryTableBody = document.getElementById("summaryTableBody");
  const tableActions = document.getElementById("tableActions");
  const detailedDataBtn = document.getElementById("detailedDataBtn");

  const ctx = document.getElementById("faultChart").getContext("2d");

  const rawData = [
    {
      id: 1,
      type: "escalator",
      name: "سلم كهربائي 1",
      faults: [
        { date: "2024-01-10", faultType: "كهربائي", technician: "محمد" },
        { date: "2024-06-25", faultType: "ميكانيكي", technician: "علي" },
        { date: "2024-07-02", faultType: "كهربائي", technician: "أحمد" },
        { date: "2024-07-15", faultType: "ميكانيكي", technician: "سارة" },
        { date: "2024-08-10", faultType: "كهربائي", technician: "مريم" },
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
        { date: "2024-07-22", faultType: "ميكانيكي", technician: "ماجد" },
        { date: "2024-09-02", faultType: "كهربائي", technician: "علي" },
      ],
    },
    {
      id: 3,
      type: "elevator",
      name: "مصعد 5",
      faults: [
        { date: "2024-02-08", faultType: "كهربائي", technician: "خالد" },
        { date: "2024-07-09", faultType: "ميكانيكي", technician: "علي" },
        { date: "2024-06-20", faultType: "كهربائي", technician: "محمد" },
        { date: "2024-07-11", faultType: "ميكانيكي", technician: "نور" },
        { date: "2024-08-14", faultType: "كهربائي", technician: "سارة" },
      ],
    },
  ];

  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
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

  // حساب الأعطال الشهرية لكل نوع مرفق
  function getMonthlyFaultCountsByType(year) {
    const counts = {
      escalator: new Array(12).fill(0),
      gate: new Array(12).fill(0),
      elevator: new Array(12).fill(0),
    };

    rawData.forEach((facility) => {
      facility.faults.forEach((fault) => {
        const faultYear = new Date(fault.date).getFullYear();
        if (faultYear === year) {
          const month = new Date(fault.date).getMonth();
          counts[facility.type][month]++;
        }
      });
    });

    return counts;
  }

  // حساب إجمالي الأعطال الشهرية لجميع المرافق
  function getTotalMonthlyFaults(monthlyCounts) {
    const total = new Array(12).fill(0);
    for (let i = 0; i < 12; i++) {
      total[i] =
        monthlyCounts.escalator[i] +
        monthlyCounts.gate[i] +
        monthlyCounts.elevator[i];
    }
    return total;
  }

  // إيجاد أكثر شهر فيه أعطال (حسب الإجمالي)
  function getMaxFaultMonth(totalCounts) {
    let maxCount = 0;
    let maxMonthIndex = 0;
    totalCounts.forEach((count, i) => {
      if (count > maxCount) {
        maxCount = count;
        maxMonthIndex = i;
      }
    });
    return { maxMonthIndex, maxCount };
  }

  // تحديث جدول ملخص الأعطال الشهري
  function updateMonthlySummaryTable(totalCounts) {
    summaryTableBody.innerHTML = "";
    months.forEach((monthName, index) => {
      summaryTableBody.innerHTML += `
        <tr>
          <td>${monthName}</td>
          <td>${totalCounts[index]}</td>
        </tr>
      `;
    });
    summaryTableSection.style.display = "block";
  }

  // تحديث التنبيه الذكي وزر البيانات المفصلة
  function updateSmartAlert(totalCounts) {
    const { maxMonthIndex, maxCount } = getMaxFaultMonth(totalCounts);
    analysisText.textContent = `⚠️ أكثر شهر فيه أعطال هو ${months[maxMonthIndex]} وعدد الأعطال فيه ${maxCount}.`;
    analysisBox.style.display = "flex";
    reportBtn.style.display = "none";
    detailedDataBtn.style.display = "inline-block";
    tableActions.style.display = "flex";
  }

  // الرسم البياني مع التأثير البصري عند hover
  let faultChart = null;
  function updateChart(year) {
    const monthlyCounts = getMonthlyFaultCountsByType(year);
    const totalCounts = getTotalMonthlyFaults(monthlyCounts);

    if (faultChart) {
      faultChart.destroy();
    }

    const datasets = [
      {
        label: "مصعد",
        data: monthlyCounts.elevator,
        backgroundColor: "rgba(0, 123, 255, 0.8)", // أزرق داكن
      },
      {
        label: "سلم كهربائي",
        data: monthlyCounts.escalator,
        backgroundColor: "rgba(135, 206, 250, 0.7)", // أزرق فاتح (SkyBlue)
      },
      {
        label: "بوابة إلكترونية",
        data: monthlyCounts.gate,
        backgroundColor: "rgba(255, 255, 224, 0.7)", // أصفر باهت (LightYellow)
      },
    ];

    faultChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: datasets,
      },
      options: {
        responsive: true,
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: true,
        },
        plugins: {
          tooltip: {
            enabled: true,
            mode: "nearest",
            intersect: true,
            callbacks: {
              label: (ctx) => {
                const label = ctx.dataset.label || "";
                const value = ctx.parsed.y || 0;
                const month = ctx.chart.data.labels[ctx.dataIndex];
                return `${label}: ${value} أعطال `;
              },
            },
          },
          legend: {
            labels: {
              boxWidth: 20,
              padding: 15,
              font: { size: 14, weight: "bold" },
            },
          },
          title: {
            display: true,
            text: `عدد الأعطال حسب النوع والشهر للسنة ${year}`,
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: { stepSize: 1, precision: 0 },
          },
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
      },
      plugins: [
        {
          id: "hoverGlowLift",
          afterDatasetDraw(chart) {
            const { ctx, tooltip } = chart;
            if (tooltip._active && tooltip._active.length) {
              const activePoint = tooltip._active[0];
              const datasetIndex = activePoint.datasetIndex;
              const index = activePoint.index;
              const meta = chart.getDatasetMeta(datasetIndex);
              const bar = meta.data[index];

              ctx.save();

              ctx.shadowColor = "rgba(140, 151, 154, 0.11)";
              ctx.shadowBlur = 20;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;

              ctx.translate(0, -8);

              bar.draw(ctx);

              ctx.restore();
            }
          },
        },
      ],
    });

    updateMonthlySummaryTable(totalCounts);
    updateSmartAlert(totalCounts);
  }

  // حدث تغيير السنة
  yearFilter.addEventListener("change", () => {
    const selectedYear = +yearFilter.value;
    updateChart(selectedYear);
  });

  // زر "بيانات مفصلة" يفتح صفحة التفاصيل
  detailedDataBtn.addEventListener("click", () => {
    window.location.href = "detailed-log.html";
  });

  // تهيئة الصفحة
  fillYearFilter();

  if (yearFilter.options.length > 0) {
    yearFilter.value = yearFilter.options[yearFilter.options.length - 1].value;
  }

  updateChart(+yearFilter.value);
});

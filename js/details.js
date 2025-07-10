document.addEventListener("DOMContentLoaded", () => {
  const usageData = {
    facility: "سلم متحرك 1",
    lastMaintenance: "2025-07-09",
    threshold: 100,
    dailyUsage: [50, 70, 80, 120, 90, 110, 130],
    labels: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
  };

  // إعداد العناوين
  document.getElementById("pageTitle").textContent = `تفاصيل ${usageData.facility}`;
  document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

  // إعداد الرسم البياني
  const ctx = document.getElementById("usageChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: usageData.labels,
      datasets: [{
        label: "عدد الاستخدام",
        data: usageData.dailyUsage,
        fill: true,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        tooltip: {
          enabled: true
        },
        legend: {
          display: true,
          position: "bottom"
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: usageData.threshold + 50
        }
      }
    }
  });

  // تنبيه الاستخدام
  const lastValue = usageData.dailyUsage.at(-1);
  const alertBox = document.getElementById("alertMessage");

  if (lastValue >= usageData.threshold) {
    alertBox.textContent = "🔴 الاستخدام تجاوز الحد!";
    alertBox.classList.add("status", "danger");
  } else if (lastValue >= usageData.threshold * 0.8) {
    alertBox.textContent = "⚠️ الاستخدام يقترب من الحد!";
    alertBox.classList.add("status", "warning");
  } else {
    alertBox.textContent = "✅ الوضع طبيعي";
    alertBox.classList.add("status", "good");
  }

  // زر البلاغ
  document.getElementById("manualReportBtn").addEventListener("click", () => {
    const param = encodeURIComponent(usageData.facility);
    window.location.href = `new-report.html?facility=${param}`;
  });
});
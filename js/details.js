document.addEventListener("DOMContentLoaded", () => {
  const usageData = {
    facility: "بوابة 5",
    lastMaintenance: "2025-07-10",
    threshold: 100,
    dailyUsage: [80, 95, 100, 330, 130, 110, 140],
    labels: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
  };

  document.getElementById("pageTitle").textContent = `تفاصيل ${usageData.facility}`;
  document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

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
      interaction: { mode: 'index', intersect: false },
      plugins: {
        tooltip: { enabled: true },
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

  const latestValue = usageData.dailyUsage.at(-1);
  const alertBox = document.getElementById("alertMessage");

  if (latestValue >= usageData.threshold) {
    alertBox.textContent = "🔴 الاستخدام تجاوز الحد!";
    alertBox.classList.add("status", "danger");
  } else if (latestValue >= usageData.threshold * 0.8) {
    alertBox.textContent = "⚠️ الاستخدام يقترب من الحد!";
    alertBox.classList.add("status", "warning");
  } else {
    alertBox.textContent = "✅ الوضع طبيعي";
    alertBox.classList.add("status", "good");
  }

});
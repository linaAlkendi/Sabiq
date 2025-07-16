document.addEventListener("DOMContentLoaded", () => {
  const usageData = {
    facility: "مصعد 2",
    lastMaintenance: "2025-07-10",
    currentUsage: 1800,
    maxUsage: 3000,
    temperature: 36,
    vibration: 2.1,
    operationHours: 1120,
    hourlyUsage: [30, 20, 25, 15, 10, 5, 0, 50, 100, 200, 300, 400, 350, 280, 260, 230, 800, 180, 150, 120, 80, 60, 40, 1800],
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`)
  };

  // تحديث العنوان وتاريخ الصيانة
  document.getElementById("pageTitle").textContent = `تفاصيل ${usageData.facility}`;
  document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

  // رسم البيانات على مدار الساعة
  const ctx = document.getElementById("usageChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: usageData.labels,
      datasets: [{
        label: "عدد الاستخدام لكل ساعة",
        data: usageData.hourlyUsage,
        fill: true,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: { enabled: true },
        legend: { display: true, position: "bottom" }
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 500
        }
      }
    }
  });

  // حالة التنبيه بناء على الاستخدام الحالي
  const alertBox = document.getElementById("alertMessage");
  if (usageData.currentUsage >= usageData.maxUsage) {
    alertBox.textContent = "🔴 الاستخدام تجاوز الحد!";
    alertBox.classList.add("status", "danger");
  } else if (usageData.currentUsage >= usageData.maxUsage * 0.8) {
    alertBox.textContent = "⚠️ الاستخدام يقترب من الحد!";
    alertBox.classList.add("status", "warning");
  } else {
    alertBox.textContent = "✅ الوضع طبيعي";
    alertBox.classList.add("status", "good");
  }

  // عرض القيم
  document.getElementById("usageValue").textContent = `${usageData.currentUsage} / ${usageData.maxUsage}`;
  document.getElementById("temperatureValue").textContent = `${usageData.temperature}°C`;
  document.getElementById("vibrationValue").textContent = `${usageData.vibration} مم/ث`;
  document.getElementById("hoursValue").textContent = `${usageData.operationHours} ساعة`;
});

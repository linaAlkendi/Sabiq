document.addEventListener("DOMContentLoaded", () => {
  const usageData = {
    facility: "بوابة 5",
    lastMaintenance: "2025-07-10",
    currentUsage: 3300, 
    maxUsage: 3200,
    temperature: 63,
    vibration: 6,
    operationHours: 1870,
    hourlyUsage: [30, 20, 25, 15, 10, 5, 0, 50, 100, 200, 300, 400, 3050, 2080, 2060, 2300, 2000, 1800, 1500, 1200, 2400, 2600, 3000, 3200],
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`)
  };

  // تحديث عنوان الصفحة
  document.getElementById("pageTitle").textContent = `تفاصيل ${usageData.facility}`;
  
  // تحديث تاريخ آخر صيانة
  document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

  // رسم البيانات باستخدام Chart.js
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

  // الرسالة التنبيهية
  const alertBox = document.getElementById("alertMessage");
  if (usageData.currentUsage > usageData.maxUsage) {
    alertBox.textContent = "🔴 الاستخدام تجاوز الحد!";
    alertBox.classList.add("status", "danger");
  } else if (usageData.currentUsage >= usageData.maxUsage * 0.8) {
    alertBox.textContent = "⚠️ الاستخدام يقترب من الحد!";
    alertBox.classList.add("status", "warning");
  } else {
    alertBox.textContent = "✅ الوضع طبيعي";
    alertBox.classList.add("status", "good");
  }

  // تحديث العناصر لتعرض البيانات
  document.getElementById("usageValue").textContent = `${usageData.currentUsage} / ${usageData.maxUsage}`;
  document.getElementById("tempVal").textContent = `${usageData.temperature}°C`;
  document.getElementById("vibrationVal").textContent = `${usageData.vibration}`;
  document.getElementById("hoursVal").textContent = `${usageData.operationHours} ساعة`;
});

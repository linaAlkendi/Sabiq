document.addEventListener("DOMContentLoaded", () => {
  const usageData = {
    facility: "سلم متحرك 1",
    lastMaintenance: "2025-07-10",
    currentUsage: 2950,
    maxUsage: 3000,
    temperature: 48,
    vibration: 4.1,
    operationHours: 1350,
    hourlyUsage: [30, 20, 25, 15, 10, 5, 0, 50, 100, 200, 300, 400, 350, 280, 260, 230, 200, 180, 150, 120, 80, 60, 40, 30],
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`)
  };

  // تحديث العنوان وتاريخ الصيانة
  document.getElementById("pageTitle").textContent = `تفاصيل ${usageData.facility}`;
  document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

    document.getElementById("pageTitle").textContent = `تفاصيل ${usageData.facility}`;
  document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

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

  const alertBox = document.getElementById("alertMessage");
  let alerts = [];

  if (usageData.currentUsage > usageData.maxUsage) {
    alerts.push("🔴 عدد الاستخدام تجاوز الحد الأقصى (3200)");
  } else if (usageData.currentUsage >= usageData.maxUsage * 0.8) {
    alerts.push("⚠️ الاستخدام يقترب من الحد!");
  }

  if (usageData.temperature > 60) {
    alerts.push("🔥 درجة الحرارة مرتفعة (أعلى من 60°C)");
  }

  if (usageData.vibration > 5) {
    alerts.push("⚠️ مستوى الاهتزاز مرتفع (أعلى من 5)");
  }

  if (usageData.operationHours > 1800) {
    alerts.push("⏱️ عدد ساعات التشغيل تجاوز 1800 ساعة");
  }

  if (alerts.length > 0) {
    alertBox.innerHTML = alerts.join("<br>");
    alertBox.classList.add("status", "danger");
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

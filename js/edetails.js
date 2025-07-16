document.addEventListener("DOMContentLoaded", () => {
  const usageData = {
    facility: "مصعد 2",
    lastMaintenance: "2025-07-10",

    // ✅ بيانات الاستخدام
    currentUsage: 180,
    maxUsage: 300,

    // ✅ بيانات الساعات الحالية (اليوم فقط)
    hourlyUsage: [5, 10, 15, 20, 18, 22, 25, 28, 30, 32, 35, 40],
    hourLabels: ["1 ص", "2 ص", "3 ص", "4 ص", "5 ص", "6 ص", "7 ص", "8 ص", "9 ص", "10 ص", "11 ص", "12 ظ"],

    // ✅ بيانات إضافية
    temperature: 41,
    vibration: "طبيعي",
    operatingHours: 1145
  };

  // تحديث العنوان
  document.getElementById("pageTitle").textContent = `تفاصيل ${usageData.facility}`;
  document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

  // عرض البيانات المباشرة
  document.getElementById("tempVal").textContent = `${usageData.temperature}°C`;
  document.getElementById("vibrationVal").textContent = usageData.vibration;
  document.getElementById("hoursVal").textContent = `${usageData.operatingHours} ساعة`;

  // الاستخدام الحالي
  const usageBox = document.getElementById("usageValue");
  usageBox.textContent = `${usageData.currentUsage} / ${usageData.maxUsage} استخدام`;

  // رسم الرسم البياني
  const ctx = document.getElementById("usageChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: usageData.hourLabels,
      datasets: [{
        label: "الاستخدام خلال اليوم",
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
          suggestedMax: Math.max(...usageData.hourlyUsage) + 10
        }
      }
    }
  });

  // حالة التنبيه بناءً على الاستخدام الحقيقي
  const usagePercent = (usageData.currentUsage / usageData.maxUsage) * 100;
  const alertBox = document.getElementById("alertMessage");

  if (usagePercent >= 100) {
    alertBox.textContent = "🔴 الاستخدام تجاوز الحد!";
    alertBox.classList.add("status", "danger");
  } else if (usagePercent >= 80) {
    alertBox.textContent = "⚠️ الاستخدام يقترب من الحد!";
    alertBox.classList.add("status", "warning");
  } else {
    alertBox.textContent = "✅ الوضع طبيعي";
    alertBox.classList.add("status", "good");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const usageData = {
    facility: "بوابة 5",
    lastMaintenance: "2025-07-10",

    // ✅ بيانات الاستخدام الفعلي (الحقيقي)
    currentUsage: 320,
    maxUsage: 300,

    // ✅ بيانات اليوم الحالي فقط (بالساعات)
    hourlyUsage: [10, 15, 22, 28, 30, 35, 40, 45, 50, 55, 60, 65],
    hourLabels: ["1 ص", "2 ص", "3 ص", "4 ص", "5 ص", "6 ص", "7 ص", "8 ص", "9 ص", "10 ص", "11 ص", "12 ظ"],

    // ✅ بيانات إضافية
    temperature: 62,
    vibration: "عالي",
    operatingHours: 1870
  };

  // تحديث العنوان
  document.getElementById("pageTitle").textContent = `تفاصيل ${usageData.facility}`;
  document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

  // عرض البيانات المباشرة
  document.getElementById("tempVal").textContent = `${usageData.temperature}°C`;
  document.getElementById("vibrationVal").textContent = usageData.vibration;
  document.getElementById("hoursVal").textContent = `${usageData.operatingHours} ساعة`;

  // ✅ عرض الاستخدام الحالي / الأقصى
  const usageBox = document.getElementById("usageValue");
  usageBox.textContent = `${usageData.currentUsage} / ${usageData.maxUsage} استخدام`;

  // ✅ عرض الرسم البياني لليوم
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

  // ✅ تنبيه بناءً على الاستخدام الفعلي (320/300)
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

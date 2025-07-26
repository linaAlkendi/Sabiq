document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const facilityId = urlParams.get("id");

  if (!facilityId) {
    alert("لم يتم تحديد المرفق.");
    return;
  }

  try {
    const res = await fetch(`https://sabiq-node-backend.onrender.com/facilities/${facilityId}`);
    if (!res.ok) throw new Error("حدث خطأ أثناء جلب البيانات");
    const usageData = await res.json();

    // ⬇️ Hardcoded for now until "lastMaintenance" is available
    usageData.lastMaintenance = "2025-07-10";

    // Set title and heading
    document.getElementById("pageTitleText").textContent = `تفاصيل ${usageData.name}`;
    document.getElementById("facilityName").textContent = `تفاصيل ${usageData.name}`;
    document.getElementById("maintenanceDate").textContent = usageData.lastMaintenance;

    // Chart data
    const ctx = document.getElementById("usageChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        datasets: [{
          label: "عدد الاستخدام لكل ساعة",
          data: generateFakeHourlyUsage(usageData.currentUsage),
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

    // 🔔 Enhanced Alerts System with SVG Icons
    const alertBox = document.getElementById("alertMessage");
    let alerts = [];

    // SVG Icons
    const icons = {
      danger: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>`,
      warning: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>`,
      temperature: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
                    </svg>`,
      vibration: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                    <path d="M6 8H5a4 4 0 0 0 0 8h1"></path>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>`,
      pressure: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                   <circle cx="12" cy="12" r="10"></circle>
                   <circle cx="12" cy="12" r="4"></circle>
                   <line x1="12" y1="2" x2="12" y2="4"></line>
                   <line x1="12" y1="20" x2="12" y2="22"></line>
                   <line x1="5" y1="5" x2="6" y2="6"></line>
                   <line x1="18" y1="18" x2="19" y2="19"></line>
                   <line x1="2" y1="12" x2="4" y2="12"></line>
                   <line x1="20" y1="12" x2="22" y2="12"></line>
                   <line x1="5" y1="19" x2="6" y2="18"></line>
                   <line x1="18" y1="5" x2="19" y2="6"></line>
                 </svg>`,
      humidity: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>`,
      motor: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                <rect x="2" y="4" width="20" height="15" rx="2"></rect>
                <circle cx="8" cy="11" r="2"></circle>
                <path d="M8 11h8"></path>
                <circle cx="16" cy="11" r="2"></circle>
                <path d="M6 19v2"></path>
                <path d="M18 19v2"></path>
              </svg>`,
      clock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>`,
      check: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="alert-icon">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>`
    };

    if (usageData.status !== "danger") {
      if (usageData.currentUsage > usageData.maxUsage) {
        alerts.push({
          text: "عدد الاستخدام تجاوز الحد الأعلى",
          icon: icons.danger,
          severity: "critical"
        });
      } else if (usageData.currentUsage >= usageData.maxUsage * 0.8) {
        alerts.push({
          text: "الاستخدام يقترب من الحد الأعلى!",
          icon: icons.warning,
          severity: "warning"
        });
      }

      const hours = parseFloat(usageData.operationHours ?? usageData.operatingHours ?? "0");
      const temp = parseFloat((usageData.temperature || "0").replace(/[^\d.]/g, ""));
      const vib = parseFloat((usageData.vibration || "0").replace(/[^\d.]/g, ""));
      const pressure = parseFloat((usageData.pressure || "0").replace(/[^\d.]/g, ""));
      const humidity = parseFloat((usageData.humidity || "0").replace(/[^\d.]/g, ""));
      const motor_load = parseFloat((usageData.motor_load || "0").replace(/[^\d.]/g, ""));

      if (temp > 55) alerts.push({
        text: "مستوى الحرارة مرتفع (أعلى من 55 C)",
        icon: icons.temperature,
        severity: "warning"
      });
      if (vib > 6) alerts.push({
        text: "مستوى الاهتزاز مرتفع (أعلى من 6 mm/s)",
        icon: icons.vibration,
        severity: "warning"
      });
      if (pressure > 60) alerts.push({
        text: "الضغط مرتفع (أعلى من 60 Pa)",
        icon: icons.pressure,
        severity: "warning"
      });
      if (humidity > 25) alerts.push({
        text: "الرطوبة مرتفعة (أعلى من 25%)",
        icon: icons.humidity,
        severity: "warning"
      });
      if (motor_load > 80) alerts.push({
        text: "حمل المحرك مرتفع (أعلى من 80%)",
        icon: icons.motor,
        severity: "warning"
      });
      if (hours > 1800) alerts.push({
        text: "عدد ساعات التشغيل مرتفع (أعلى من 1800 ساعة)",
        icon: icons.clock,
        severity: "warning"
      });

      if (alerts.length > 0) {
        const alertHTML = alerts.map(alert => `
          <div class="alert-item ${alert.severity}">
            ${alert.icon}
            <span>${alert.text}</span>
          </div>
        `).join("");
        
        alertBox.innerHTML = `
          <div class="status-badge danger">تنبيهات النظام</div>
          ${alertHTML}
        `;
        alertBox.classList.add("status", "danger");
        
        if (alerts.some(a => a.severity === "critical")) {
          alertBox.classList.add("critical");
        }
      } else {
        alertBox.innerHTML = `
          <div class="status-badge good">حالة النظام</div>
          <div class="alert-item">
            ${icons.check}
            <span>الوضع طبيعي</span>
          </div>
        `;
        alertBox.classList.add("status", "good");
      }

      // 📊 Stats
      document.getElementById("usageValue").textContent =
        isNaN(usageData.currentUsage) || isNaN(usageData.maxUsage)
          ? "—"
          : `${usageData.currentUsage} / ${usageData.maxUsage}`;
      document.getElementById("tempVal").textContent = usageData.temperature ?? "—";
      document.getElementById("vibrationVal").textContent = usageData.vibration ?? "—";
      document.getElementById("hoursVal").textContent = isNaN(hours) ? "—" : `${hours} ساعة`;
      document.getElementById("pressureVal").textContent = usageData.pressure ?? "—";
      document.getElementById("humidityVal").textContent = usageData.humidity ?? "—";
      document.getElementById("motorLoadVal").textContent = usageData.motor_load ?? "—";
    } else {
      alertBox.innerHTML = `
        <div class="status-badge danger">حالة حرجة</div>
        <div class="alert-item critical">
          ${icons.danger}
          <span>المرفق معطل! الرجاء التحقق من الحالة.</span>
        </div>
      `;
      alertBox.classList.add("status", "danger", "critical");
    }
  } catch (err) {
    console.error(err);
    alert("تعذر تحميل بيانات المرفق.");
  }
});

function generateFakeHourlyUsage(totalUsage) {
  const hourlyUsage = [];
  const base = Math.floor(totalUsage / 24);
  for (let i = 0; i < 24; i++) {
    hourlyUsage.push(base + Math.floor(Math.random() * 40 - 20)); // ±20 variation
  }
  console.log("Hourly Usage for Chart:", hourlyUsage); // 👀 debug
  return hourlyUsage;
}
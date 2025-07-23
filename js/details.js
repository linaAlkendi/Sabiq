document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const facilityId = urlParams.get("id");

  if (!facilityId) {
    alert("لم يتم تحديد المرفق.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/facilities/${facilityId}`);
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

    // 🔔 Alerts
    const alertBox = document.getElementById("alertMessage");
    let alerts = [];

    if (usageData.currentUsage > usageData.maxUsage) {
      alerts.push("🔴 عدد الاستخدام تجاوز الحد الأقصى");
    } else if (usageData.currentUsage >= usageData.maxUsage * 0.8) {
      alerts.push("⚠️ الاستخدام يقترب من الحد!");
    }

    const temp = parseFloat(usageData.temperature);
    const vib = parseFloat(usageData.vibration);
    const hours = parseFloat(usageData.operationHours ?? usageData.operatingHours);
    const currentUsage = parseInt(usageData.currentUsage);
    const maxUsage = parseInt(usageData.maxUsage);

    if (temp > 60) alerts.push("🔥 درجة الحرارة مرتفعة (أعلى من 60°C)");
    if (vib > 5) alerts.push("⚠️ مستوى الاهتزاز مرتفع (أعلى من 5)");
    if (hours > 1800) alerts.push("⏱️ عدد ساعات التشغيل تجاوز 1800 ساعة");

    if (alerts.length > 0) {
      alertBox.innerHTML = alerts.join("<br>");
      alertBox.classList.add("status", "danger");
    } else {
      alertBox.textContent = "✅ الوضع طبيعي";
      alertBox.classList.add("status", "good");
    }

    // 📊 Stats
    document.getElementById("usageValue").textContent =
      isNaN(currentUsage) || isNaN(maxUsage)
        ? "—"
        : `${currentUsage} / ${maxUsage}`;
    document.getElementById("tempVal").textContent = usageData.temperature;
    document.getElementById("vibrationVal").textContent = usageData.vibration;
    document.getElementById("hoursVal").textContent = isNaN(hours) ? "—" : `${hours} ساعة`;
    document.getElementById("pressureVal").textContent = usageData.pressure ?? "—";
    document.getElementById("humidityVal").textContent = usageData.humidity ?? "—";
    document.getElementById("motorLoadVal").textContent = usageData.motor_load ?? "—";

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


document.addEventListener("DOMContentLoaded", () => {
  // بيانات وهمية (ثابتة)
  const data = [
    {
      "اسم الفني": "نجلاء العبدالله",
      "عدد البلاغات": 15,
      "متوسط سرعة الاستجابة (ساعات)": 2.5,
      "متوسط مدة الإصلاح (ساعات)": 4.2,
      "نسبة الأعطال المعادة (%)": 5,
      "تقييم الجودة": 4.8
    },
    {
      "اسم الفني": "محمد السبيعي",
      "عدد البلاغات": 22,
      "متوسط سرعة الاستجابة (ساعات)": 1.8,
      "متوسط مدة الإصلاح (ساعات)": 3.5,
      "نسبة الأعطال المعادة (%)": 8,
      "تقييم الجودة": 4.5
    },
    {
      "اسم الفني": "سارة الحربي",
      "عدد البلاغات": 10,
      "متوسط سرعة الاستجابة (ساعات)": 3.0,
      "متوسط مدة الإصلاح (ساعات)": 5.0,
      "نسبة الأعطال المعادة (%)": 2,
      "تقييم الجودة": 4.9
    }
  ];

  // عرض البيانات في الجدول
  const tbody = document.getElementById("techniciansTableBody");
  tbody.innerHTML = "";
  data.forEach(f => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${f["اسم الفني"]}</td>
      <td>${f["عدد البلاغات"]}</td>
      <td>${f["متوسط سرعة الاستجابة (ساعات)"].toFixed(2)}</td>
      <td>${f["متوسط مدة الإصلاح (ساعات)"].toFixed(2)}</td>
      <td>${f["نسبة الأعطال المعادة (%)"]}%</td>
      <td>${f["تقييم الجودة"].toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  // حساب المتوسطات العامة
  const avgResponse = data.reduce((a, c) => a + c["متوسط سرعة الاستجابة (ساعات)"], 0) / data.length;
  const avgRepair = data.reduce((a, c) => a + c["متوسط مدة الإصلاح (ساعات)"], 0) / data.length;
  const avgReopened = data.reduce((a, c) => a + c["نسبة الأعطال المعادة (%)"], 0) / data.length;
  const avgQuality = data.reduce((a, c) => a + c["تقييم الجودة"], 0) / data.length;

  // عرض المتوسطات
  document.getElementById("avgResponseTime").textContent = avgResponse.toFixed(2);
  document.getElementById("avgRepairTime").textContent = avgRepair.toFixed(2);
  document.getElementById("reopenedRate").textContent = avgReopened.toFixed(1) + "%";
  document.getElementById("qualityRating").textContent = avgQuality.toFixed(2) + " / 5";

  // بيانات الرسم البياني الراداري
  const labels = data.map(f => f["اسم الفني"]);
  const responseData = data.map(f => f["متوسط سرعة الاستجابة (ساعات)"]);
  const repairData = data.map(f => f["متوسط مدة الإصلاح (ساعات)"]);
  const reopenedData = data.map(f => f["نسبة الأعطال المعادة (%)"]);
  const qualityData = data.map(f => f["تقييم الجودة"]);

  const ctx = document.getElementById("technicianRadarChart").getContext("2d");

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'سرعة الاستجابة (ساعات)',
          data: responseData,
          borderColor: '#4a90e2',
          backgroundColor: 'rgba(74,144,226,0.3)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'مدة الإصلاح (ساعات)',
          data: repairData,
          borderColor: '#f39c12',
          backgroundColor: 'rgba(243,156,18,0.3)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'نسبة الأعطال المعادة (%)',
          data: reopenedData,
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231,76,60,0.3)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'تقييم الجودة',
          data: qualityData,
          borderColor: '#27ae60',
          backgroundColor: 'rgba(39,174,96,0.3)',
          fill: true,
          tension: 0.3,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          angleLines: { color: '#888' },
          grid: { color: '#ccc' },
          pointLabels: { color: '#222' },
          min: 0,
          max: 10
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#222' }
        },
        title: {
          display: true,
          text: 'مقارنة أداء الفنيين',
          color: '#003366'
        },
      }
    }
  });

  // توليد توصيات ذكية
  const recs = [];
  data.forEach(f => {
    if (f["نسبة الأعطال المعادة (%)"] > 7)
      recs.push(`مراجعة أداء الفني ${f["اسم الفني"]} بسبب ارتفاع نسبة الأعطال المعادة.`);
    if (f["متوسط سرعة الاستجابة (ساعات)"] > 3)
      recs.push(`تحسين سرعة استجابة الفني ${f["اسم الفني"]}.`);
    if (f["تقييم الجودة"] < 4.5)
      recs.push(`تدريب إضافي للفني ${f["اسم الفني"]} لتحسين جودة العمل.`);
  });
  if (recs.length === 0) recs.push("كل الفنيين يعملون بأداء ممتاز. استمروا على هذا المستوى!");

  const recList = document.getElementById("recommendationsList");
  recList.innerHTML = "";
  recs.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r;
    recList.appendChild(li);
  });
});

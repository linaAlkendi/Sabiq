document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/api/detailed-log/incidents")
    .then(res => res.json())
    .then(data => {
      const months = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
      ];

      const types = ["مصعد", "سلم كهربائي", "بوابة إلكترونية"];
      const faultTypes = ["ميكانيكي", "كهربائي", "أخرى"];
      const colors = {
        "مصعد": "#3e95cd",
        "سلم كهربائي": "#a5d8ff",
        "بوابة إلكترونية": "#fff3bf",
        "ميكانيكي": "#da8379",
        "كهربائي": "#a5d8ff",
        "أخرى": "#5e9f79"
      };

      const monthlyCounts = {};
      const typeCounts = { ميكانيكي: 0, كهربائي: 0, أخرى: 0 };
      const severityCounts = { عالي: 0, متوسط: 0, منخفض: 0 };
      const monthlyResponseTimes = {};

      data.forEach(item => {
        const date = new Date(item["تاريخ العطل"]);
        const month = date.toLocaleString("ar-EG", { month: "long" });
        const facilityType = item["نوع المرفق"];
        const faultType = item["نوع العطل"]?.trim() || "أخرى";
        const severity = item["درجة الخطورة"]?.trim();
        const responseTime = parseFloat(item["زمن الاستجابة"]) || 0;

        if (!monthlyCounts[month]) monthlyCounts[month] = {};
        if (!monthlyCounts[month][facilityType]) monthlyCounts[month][facilityType] = 0;
        monthlyCounts[month][facilityType]++;

        if (faultTypes.includes(faultType)) typeCounts[faultType]++;
        else typeCounts["أخرى"]++;

        if (severityCounts.hasOwnProperty(severity)) severityCounts[severity]++;

        if (!monthlyResponseTimes[month]) monthlyResponseTimes[month] = [];
        if (responseTime > 0) monthlyResponseTimes[month].push(responseTime);
      });

      // شريطي
      const datasets = types.map(type => ({
        label: type,
        backgroundColor: colors[type],
        data: months.map(month => (monthlyCounts[month]?.[type] || 0))
      }));

      new Chart(document.getElementById("monthlyBreakdownChart"), {
        type: "bar",
        data: { labels: months, datasets },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "عدد الأعطال حسب نوع المرفق على مدار الأشهر" },
            legend: { position: "top" },
            tooltip: {
              callbacks: {
                label: context => `${context.dataset.label}: ${context.raw} أعطال`
              }
            }
          },
          scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
        }
      });

      // دائري
      new Chart(document.getElementById("faultTypeChart"), {
        type: "doughnut",
        data: {
          labels: faultTypes,
          datasets: [{
            data: faultTypes.map(type => typeCounts[type]),
            backgroundColor: faultTypes.map(type => colors[type]),
            borderColor: "#fff", borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          cutout: "70%",
          plugins: {
            title: { display: true, text: "توزيع الأعطال حسب النوع" },
            legend: { position: "bottom" }
          }
        }
      });

      // مساحي
      new Chart(document.getElementById("severityChart"), {
        type: "polarArea",
        data: {
          labels: Object.keys(severityCounts),
          datasets: [{
            data: Object.values(severityCounts),
            backgroundColor: [
              "rgba(231, 76, 60, 0.7)",
              "rgba(241, 196, 15, 0.7)",
              "rgba(46, 204, 113, 0.7)"
            ],
            borderColor: "#fff", borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "توزيع الأعطال حسب مستوى الخطورة" }
          }
        }
      });

      // خطي
      new Chart(document.getElementById("responseTimeChart"), {
        type: "line",
        data: {
          labels: months,
          datasets: [{
            label: "متوسط وقت الإصلاح (ساعات)",
            data: months.map(month => {
              const times = monthlyResponseTimes[month];
              return times?.length ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1) : 0;
            }),
            backgroundColor: "rgba(52, 152, 219, 0.2)",
            borderColor: "rgba(52, 152, 219, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "متوسط وقت الإصلاح الشهري (بالساعات)" }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });

      // رادار
      new Chart(document.getElementById("facilityRadarChart"), {
        type: "radar",
        data: {
          labels: faultTypes,
          datasets: types.map(type => ({
            label: type,
            data: faultTypes.map(ft =>
              data.filter(d => d["نوع المرفق"] === type && (d["نوع العطل"]?.trim() || "أخرى") === ft).length
            ),
            backgroundColor: `${colors[type]}40`,
            borderColor: colors[type],
            borderWidth: 2
          }))
        },
        options: {
          responsive: true,
          plugins: {
            title: { display: true, text: "مقارنة أنواع الأعطال بين المرافق المختلفة" }
          },
          scales: { r: { beginAtZero: true } }
        }
      });
      
// تحليل وقت الاستجابة
const monthlyAvgResponse = months.map(month => {
  const times = monthlyResponseTimes[month];
  return times?.length ? (times.reduce((a, b) => a + b, 0) / times.length) : 0;
});

const maxResponseMonthIndex = monthlyAvgResponse.indexOf(Math.max(...monthlyAvgResponse));
const minResponseMonthIndex = monthlyAvgResponse.indexOf(Math.min(...monthlyAvgResponse.filter(Boolean)));

let responseAnalysis = "";
if (maxResponseMonthIndex >= 0 && minResponseMonthIndex >= 0) {
  responseAnalysis = `تحليل أوقات الإصلاح يظهر أن أطول وقت استجابة كان في شهر ${months[maxResponseMonthIndex]} (بمتوسط ${monthlyAvgResponse[maxResponseMonthIndex].toFixed(1)} ساعة)، بينما كان الأسرع في ${months[minResponseMonthIndex]} (بمتوسط ${monthlyAvgResponse[minResponseMonthIndex].toFixed(1)} ساعة).`;
} else {
  responseAnalysis = "لا توجد بيانات كافية لتحليل أوقات الاستجابة.";
}
document.getElementById("responseTimeCard").textContent = responseAnalysis;

// تحليل مستوى الخطورة
const severityAnalysis = `توزيع الأعطال حسب الخطورة يظهر أن ${Math.max(...Object.values(severityCounts))} عطلًا تم تصنيفها على أنها ${Object.entries(severityCounts).sort((a,b)=>b[1]-a[1])[0][0]}، مما يستدعي إعادة تقييم إجراءات الصيانة الوقائية.`;
document.getElementById("severityCard").textContent = severityAnalysis;

// تحليل المرافق
const facilityTypeCounts = {};
types.forEach(type => {
  facilityTypeCounts[type] = data.filter(item => item["نوع المرفق"] === type).length;
});

const maxFacility = Object.entries(facilityTypeCounts).sort((a,b)=>b[1]-a[1])[0];
const facilityAnalysis = `تحليل المرافق يظهر أن ${maxFacility[0]} يمثل أعلى نسبة أعطال (${maxFacility[1]} عطلًا)، مما يشير إلى ضرورة التركيز على تحسين جودة الصيانة لهذا النوع من المرافق.`;
document.getElementById("facilityCard").textContent = facilityAnalysis;
      // تحليل نوع العطل
      const maxType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
      const failureMsg = {
        "ميكانيكي": "حسب التحليل، الأعطال الميكانيكية هي الأكثر شيوعاً، مما يشير إلى ضرورة التركيز على صيانة الأجزاء الميكانيكية.",
        "كهربائي": "حسب التحليل، الأعطال الكهربائية هي الأكثر شيوعاً، مما يشير إلى ضرورة التركيز على صيانة الدوائر الكهربائية.",
        "أخرى": "حسب التحليل، الأعطال الأخرى هي الأكثر شيوعاً، مما يشير إلى ضرورة مراجعة الإجراءات الحالية."
      };
      document.getElementById("topFailureCard").textContent = failureMsg[maxType[0]];

      // تحليل الأشهر
      const monthTotals = {};
      months.forEach(month => {
        monthTotals[month] = types.reduce((sum, type) => sum + (monthlyCounts[month]?.[type] || 0), 0);
      });

      const maxMonthCount = Math.max(...Object.values(monthTotals));
      const topMonths = Object.entries(monthTotals).filter(([_, count]) => count === maxMonthCount && count > 0).map(([month]) => month);

      let topMonthText = "";
      if (topMonths.length === 1) {
        topMonthText = `حسب التحليل، أعلى عدد من الأعطال سُجِّل في شهر ${topMonths[0]}، وبلغ ${maxMonthCount} عطلاً.`;
      } else if (topMonths.length > 1) {
        topMonthText = `حسب التحليل، الأشهر التي سُجِّل فيها أعلى عدد من الأعطال هي: ${topMonths.join(" و ")}، بعدد ${maxMonthCount} أعطال لكل منها.`;
      } else {
        topMonthText = "لا توجد بيانات كافية لتحليل الأشهر.";
      }
      document.getElementById("topMonthsCard").textContent = topMonthText;
    })
    .catch(err => {
      console.error("فشل في تحميل البيانات:", err);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("../backend/data/incidentData.json")
    .then(res => res.json())
    .then(data => {
      const months = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
      ];
      const types = ["مصعد", "سلم كهربائي", "بوابة إلكترونية"];
      const colors = {
        "مصعد": "#3e95cd",
        "سلم كهربائي": "#a5d8ff",
        "بوابة إلكترونية": "#fff3bf"
      };

      const monthlyCounts = {};
      const typeCounts = {
        ميكانيكي: 0,
        كهربائي: 0,
        أخرى: 0
      };

      for (const item of data) {
        const date = new Date(item["تاريخ العطل"]);
        if (date.getFullYear() !== 2024) continue;

        // 📊 الرسم البياني الشريطي:
        const month = date.toLocaleString("ar-EG", { month: "long" });
        const facilityType = item["نوع المرفق"];
        if (!monthlyCounts[month]) monthlyCounts[month] = {};
        if (!monthlyCounts[month][facilityType]) monthlyCounts[month][facilityType] = 0;
        monthlyCounts[month][facilityType]++;

        // 🥧 الرسم الدائري:
        const faultType = item["نوع العطل"]?.trim();
        if (faultType === "ميكانيكي") {
          typeCounts["ميكانيكي"]++;
        } else if (faultType === "كهربائي") {
          typeCounts["كهربائي"]++;
        } else {
          typeCounts["أخرى"]++;
        }
      }

      // 📊 رسم الرسم الشريطي
      const datasets = types.map(type => ({
        label: type,
        backgroundColor: colors[type],
        data: months.map(month => (monthlyCounts[month]?.[type] || 0))
      }));

      new Chart(document.getElementById("monthlyBreakdownChart"), {
        type: "bar",
        data: {
          labels: months,
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.raw} أعطال`;
                }
              }
            },
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'عدد الأعطال حسب نوع المرفق للعام 2024'
            }
          },
          scales: {
            x: { stacked: true },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { precision: 0 }
            }
          }
        }
      });

      // 🥧 رسم الرسم الدائري
      const ctx = document.getElementById("faultTypeChart").getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["ميكانيكي", "كهربائي", "أخرى"],
          datasets: [{
            label: "عدد الأعطال",
            data: [
              typeCounts["ميكانيكي"],
              typeCounts["كهربائي"],
              typeCounts["أخرى"]
            ],
            backgroundColor: ["#da7575ff", "#76a7e2ff", "#aed175ff"],
            borderColor: "#fff",
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "توزيع الأعطال حسب النوع",
              font: {
                size: 16
              },
              color: document.body.classList.contains("dark") ? "#6b6c6cff" : "#333"

            },
            legend: {
              position: "bottom",
              labels: {
              color: document.body.classList.contains("dark") ? "#f7feffff" : "#272727ff"
              }
            }
          }
        }
      });

      // 🧠 تحليل الأشهر
      const monthlyTotals = {};
      for (const month of months) {
        let total = 0;
        if (monthlyCounts[month]) {
          for (const type of types) {
            total += monthlyCounts[month][type] || 0;
          }
        }
        monthlyTotals[month] = total;
      }

      const maxCount = Math.max(...Object.values(monthlyTotals));
      const topMonths = Object.entries(monthlyTotals)
        .filter(([_, count]) => count === maxCount && count > 0)
        .map(([month]) => month);

      let message = "";
      if (topMonths.length > 1) {
        message = "حسب التحليل، الأشهر التي سُجِّل فيها أعلى عدد من الأعطال هي: " +
          topMonths.join(" و ") + "، بعدد إجمالي بلغ " + maxCount + " أعطال في كل منها.";
      } else if (topMonths.length === 1) {
        message = "حسب التحليل، أعلى عدد من الأعطال سُجِّل في شهر " +
          topMonths[0] + "، وبلغ " + maxCount + " عطلاً.";
      } else {
        message = "لا توجد بيانات كافية لعرض أشهر الأعطال.";
      }

      document.getElementById("topMonthsCard").textContent = message;
    })
    .catch((error) => {
      console.error("فشل في تحميل بيانات الأعطال:", error);
    });
});

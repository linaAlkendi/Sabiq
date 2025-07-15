document.addEventListener("DOMContentLoaded", function () {
  const rows = document.querySelectorAll("#logsTable tbody tr");
  const detailsSection = document.getElementById("detailsSection");
  const actionContent = document.getElementById("actionContent");
  const pdfLink = document.getElementById("pdfLink");
  const typeFilter = document.getElementById("typeFilter");
  const facilityTypeFilter = document.getElementById("facilityTypeFilter");
  const predictedFacilityEl = document.getElementById("predictedFacility");
  const predictiveAlert = document.getElementById("predictiveAlert");

  // بيانات الإجراءات وملفات PDF لكل سجل
  const faultDetails = [
    {
      actions: [
        " بلاغ مرفوع يدويا ✔️",
        "تم إرسال فرقة صيانة",
        "الفني: فهد العتيبي",
        "تاريخ الصيانة: 2025-06-02"
      ],
      pdf: "../files/report1.pdf",
      facility: "بوابة إلكترونية"
    },
    {
      actions: [
        "بلاغ مرفوع يدويا ✔️",
        "تم حل المشكلة داخليًا",
        "الفني: سارة الحربي",
        "تاريخ الصيانة: 2025-05-29"
      ],
      pdf: "../files/report2.pdf",
      facility: "سلم كهربائي"
    },
    {
      actions: [
        "تم الإبلاغ عن طريق النظام",
        "تمت إعادة تشغيل النظام",
        "الفني: علي القحطاني",
        "تاريخ الصيانة: 2025-05-16"
      ],
      pdf: "../files/report3.pdf",
      facility: "مصعد"
    },
    {
      actions: [
        "تم الإبلاغ عن طريق النظام",
        "تم استبدال القاطع",
        "الفني: نور العبدالله",
        "تاريخ الصيانة: 2025-04-23"
      ],
      pdf: "../files/report4.pdf",
      facility: "مصعد"
    },
    {
      actions: [
        "بلاغ مرفوع ✔️",
        "تم التشحيم وإعادة التركيب",
        "الفني: ماجد السبيعي",
        "تاريخ الصيانة: 2025-03-19"
      ],
      pdf: "../files/report5.pdf",
      facility: "سلم كهربائي"
    },
    {
      actions: [
        "تم الإبلاغ عن طريق النظام",
        "إعادة تشغيل السيرفر",
        "الفني: خالد العنزي",
        "تاريخ الصيانة: 2025-02-06"
      ],
      pdf: "../files/report6.pdf",
      facility: " بوابة إلكترونية"
    }
  ];

  // عرض التفاصيل عند الضغط على صف
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const index = row.getAttribute("data-index");
      const details = faultDetails[index];

      actionContent.innerHTML = details.actions
        .map((line) => `<p>${line}</p>`)
        .join("");
      pdfLink.href = details.pdf;

      detailsSection.classList.remove("hidden");
      detailsSection.scrollIntoView({ behavior: "smooth" });
    });
  });

  // فلترة حسب نوع العطل ونوع المرفق
  function filterTable() {
    const selectedType = typeFilter.value;
    const selectedFacilityType = facilityTypeFilter.value;

    rows.forEach((row) => {
      const faultType = row.children[3].textContent.trim(); // نوع العطل
      const facilityType = row.children[0].textContent.trim(); // نوع المرفق

      const matchesType = selectedType === "all" || faultType === selectedType;
      const matchesFacility = selectedFacilityType === "all" || facilityType === selectedFacilityType;

      if (matchesType && matchesFacility) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });

    detailsSection.classList.add("hidden");
  }

  typeFilter.addEventListener("change", () => {
    filterTable();
    updatePrediction();
  });

  facilityTypeFilter.addEventListener("change", () => {
    filterTable();
    updatePrediction();
  });

  // تنبؤ بالمرفق الأكثر تكرارًا
  function updatePrediction() {
    const visibleRows = Array.from(rows).filter((row) => row.style.display !== "none");
    const facilityCount = {};

    visibleRows.forEach((row) => {
      const facility = row.children[0].textContent.trim();
      facilityCount[facility] = (facilityCount[facility] || 0) + 1;
    });

    const sorted = Object.entries(facilityCount).sort((a, b) => b[1] - a[1]);
    const mostLikelyFacility = sorted.length > 0 ? sorted[0][0] : null;

    if (mostLikelyFacility) {
      predictedFacilityEl.textContent = mostLikelyFacility;
      predictiveAlert.style.display = "block";
    } else {
      predictiveAlert.style.display = "none";
    }
  }

  // أول مرة عند تحميل الصفحة
  updatePrediction();
});

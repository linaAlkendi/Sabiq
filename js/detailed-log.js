document.addEventListener("DOMContentLoaded", function () {
    const rows = document.querySelectorAll("#logsTable tbody tr");
    const detailsSection = document.getElementById("detailsSection");
    const actionContent = document.getElementById("actionContent");
    const pdfLink = document.getElementById("pdfLink");
    const typeFilter = document.getElementById("typeFilter");
  
    const faultDetails = [
      {
        actions: [
          "بلاغ مرفوع ✔️",
          "أُرسلت فرقة صيانة",
          "الفني: فهد العتيبي",
          "تاريخ الصيانة: 2025-06-02"
        ],
        pdf: "../files/report1.pdf"
      },
      {
        actions: [
          "بلاغ مرفوع ✔️",
          "تم حل المشكلة داخليًا",
          "الفني: سارة الحربي",
          "تاريخ الصيانة: 2025-05-29"
        ],
        pdf: "../files/report2.pdf"
      },
      {
        actions: [
          "بلاغ غير مرفوع",
          "المشكلة تكررت 3 مرات",
          "الفني: علي القحطاني",
          "تاريخ الصيانة: 2025-05-16"
        ],
        pdf: "../files/report3.pdf"
      },
      {
        actions: [
          "بلاغ مرفوع ✔️",
          "تم استبدال القاطع",
          "الفني: نور العبدالله",
          "تاريخ الصيانة: 2025-04-23"
        ],
        pdf: "../files/report4.pdf"
      },
      {
        actions: [
          "بلاغ مرفوع ✔️",
          "تم التشحيم وإعادة التركيب",
          "الفني: ماجد السبيعي",
          "تاريخ الصيانة: 2025-03-19"
        ],
        pdf: "../files/report5.pdf"
      },
      {
        actions: [
          "تم الإبلاغ عن طريق النظام",
          " أرسلت فرقة صيانة",
          "الفني: خالد العنزي",
          "تاريخ الصيانة: 2025-02-06"
        ],
        pdf: "../files/report6.pdf"
      }
    ];
  
    // عند الضغط على صف عطل
    rows.forEach(row => {
      row.addEventListener("click", () => {
        const index = row.getAttribute("data-index");
        const details = faultDetails[index];
  
        actionContent.innerHTML = details.actions.map(line => `<p>${line}</p>`).join("");
        pdfLink.href = details.pdf;
  
        detailsSection.classList.remove("hidden");
        detailsSection.scrollIntoView({ behavior: "smooth" });
      });
    });
  
    // فلترة حسب نوع العطل
    typeFilter.addEventListener("change", () => {
      const type = typeFilter.value;
      rows.forEach(row => {
        const faultType = row.children[1].textContent.trim();
        row.style.display = (type === "all" || faultType === type) ? "" : "none";
      });
  
      // إخفاء التفاصيل عند الفلترة
      detailsSection.classList.add("hidden");
    });
  });
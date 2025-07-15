document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("taskForm");
  const popup = document.getElementById("confirmPopup");
  const btnYes = document.getElementById("confirmYes");
  const btnNo = document.getElementById("confirmNo");

  // تأكيد التوثيق عند الضغط على "إرسال"
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // تحقق من اختيار درجة الخطورة
    const severitySelected = document.querySelector('input[name="severity"]:checked');
    if (!severitySelected) {
      alert("يرجى تحديد درجة الخطورة قبل الإرسال");
      return;
    }

    popup.style.display = "flex"; // إظهار النافذة المنبثقة
  });

  // في حال الضغط على "نعم"
  btnYes.addEventListener("click", () => {
    popup.style.display = "none";

    // إخفاء الفورم
    document.getElementById("taskForm").style.display = "none";

    // جلب اسم الفني 
    const techName = localStorage.getItem("technicianName") || "الفني";

    // عرض رسالة الشكر
    const thankYou = document.getElementById("thankYouMessage");
    document.getElementById("thankYouText").textContent = `شكرًا لك يا ${techName} على تنفيذ المهمة!`;
    thankYou.style.display = "block";
  });

  // إلغاء التوثيق
  btnNo.addEventListener("click", function () {
    popup.style.display = "none";
  });

  // القائمة الجانبية
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");

  menuToggle.addEventListener("click", function () {
    sideMenu.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("taskForm");
  const popup = document.getElementById("confirmPopup");
  const btnYes = document.getElementById("confirmYes");
  const btnNo = document.getElementById("confirmNo");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    popup.style.display = "flex"; // إظهار النافذة
  });

  confirmYes.addEventListener("click", () => {
    // إغلاق النافذة
    confirmPopup.style.display = "none";

    // إخفاء الفورم
    document.getElementById("taskForm").style.display = "none";

    // إظهار رسالة الشكر
    const thankYou = document.getElementById("thankYouMessage");
    const techName = "اسم الفني"; // localStorage.getItem("technicianName") || "الفني";
    document.getElementById("thankYouText").textContent = `شكرًا لك يا ${techName} على تنفيذ المهمة!`;
    thankYou.style.display = "block";
  });


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

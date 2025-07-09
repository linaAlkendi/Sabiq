document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");

  // فتح / إغلاق القائمة الجانبية
  toggleBtn.addEventListener("click", () => {
    sideMenu.classList.toggle("active");
  });
});

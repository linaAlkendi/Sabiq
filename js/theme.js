document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("theme-toggle-switch");

  // استرجاع المود المحفوظ من التخزين
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleSwitch.checked = true;
  }

  // تغيير الوضع عند التبديل
  toggleSwitch.addEventListener("change", () => {
    const isDark = toggleSwitch.checked;
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});

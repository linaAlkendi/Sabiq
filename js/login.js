//  التحقق من تسجيل الدخول
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // منع التحديث

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // تحقق وهمي
    if (username === "admin" && password === "1234") {
      window.location.href = "dashboard.html";
    } else {
      alert("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  });
});



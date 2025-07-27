document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const messageBox = document.getElementById("message-box");
  const loginBtn = document.getElementById("login-btn"); // Add this line

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value;

    messageBox.textContent = "";
    messageBox.className = "";

    // 🔒 Disable button and show loading
    loginBtn.disabled = true;
    loginBtn.innerText = "جاري التحقق...";

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await response.json();

      if (response.ok) {
        messageBox.textContent = "مرحبا بك في سابِق (SABIQ)";
        messageBox.className = "success-message";

        // تخزين التوكن والدور في localStorage لاستخدامها في otp.js
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", data.username);

        // التوجيه إلى صفحة otp.html بعد ثانية ونصف
        setTimeout(() => {
          window.location.href = "otp.html";
        }, 1500);

      } else {
        messageBox.textContent = data.message || "فشل تسجيل الدخول";
        messageBox.className = "error-message";
        loginBtn.disabled = false;
        loginBtn.innerText = "دخول"; // Restore button text
      }
    } catch (error) {
      console.error("خطأ في الاتصال بالسيرفر:", error);
      messageBox.textContent = "حدث خطأ في الاتصال بالخادم. حاول لاحقًا.";
      messageBox.className = "error-message";
      loginBtn.disabled = false;
      loginBtn.innerText = "دخول"; // Restore on error
    }
  });
});

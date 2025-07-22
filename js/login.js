document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const messageBox = document.getElementById("message-box");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value;

    messageBox.textContent = "";
    messageBox.className = "";

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await response.json();

      if (response.ok) {
        messageBox.textContent = "مرحبًا بكِ في سابِق";
        messageBox.className = "success-message";

        localStorage.setItem("token", data.token);

        setTimeout(() => {
          switch (data.role) {
            case "فني":
              window.location.href = "technician-dashboard.html";
              break;
            case "مشرف صيانة":
              window.location.href = "supervisor-dashboard.html";
              break;
            case "مدير عمليات":
              window.location.href = "dashboard.html";
              break;
            default:
              messageBox.textContent = " الدور غير معروف";
              messageBox.className = "error-message";
          }
        }, 1500);
      } else {
        messageBox.textContent = ` ${data.message}`;
        messageBox.className = "error-message";
      }
    } catch (error) {
      console.error("خطأ في الاتصال بالسيرفر:", error);
      messageBox.textContent = " حدث خطأ في الاتصال بالخادم. حاول لاحقًا.";
      messageBox.className = "error-message";
    }
  });
});



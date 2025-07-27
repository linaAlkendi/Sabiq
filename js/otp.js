document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".input-otp");
  const checkBtn = document.getElementById("check-btn");
  const messageBox = document.getElementById("message");
  const resendText = document.getElementById("resend-text");

  // التنقل تلقائياً بين حقول رمز التحقق
  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && idx > 0) {
        inputs[idx - 1].focus();
      }
    });
  });

  // إعادة إرسال رمز التحقق (يمكن تعديلها لاحقاً)
  resendText.addEventListener("click", () => {
    messageBox.textContent = "تم إرسال رمز تحقق جديد إلى جوالك.";
    messageBox.className = "success-message";
    // هنا يمكن إضافة منطق لإعادة إرسال الرمز (اختياري)
  });

  // التحقق من الرمز
  checkBtn.addEventListener("click", async () => {
    const otp = Array.from(inputs).map(input => input.value).join("");

    if (otp.length < inputs.length) {
      messageBox.textContent = "يرجى إدخال كامل رمز التحقق.";
      messageBox.className = "error-message";
      return;
    }

    messageBox.textContent = "";
    messageBox.className = "";

    // 🔒 Disable the button and show loading
    checkBtn.disabled = true;
    checkBtn.innerText = "جاري التحقق...";

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    try {
      const response = await fetch("https://sabiq-node-backend.onrender.com/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        messageBox.textContent = "تم التحقق بنجاح. جاري التوجيه...";
        messageBox.className = "success-message";

        setTimeout(() => {
          if (role === "فني") {
            window.location.href = "technician-dashboard.html";
          } else if (role === "مشرف صيانة") {
            window.location.href = "supervisor-dashboard.html";
          } else if (role === "مدير عمليات") {
            window.location.href = "dashboard.html";
          } else {
            messageBox.textContent = "الدور غير معروف.";
            messageBox.className = "error-message";
          }
        }, 1500);

      } else {
        messageBox.textContent = data.message || "رمز التحقق غير صحيح.";
        messageBox.className = "error-message";
        checkBtn.disabled = false;
        checkBtn.innerText = "تحقق";
      }
    } catch (error) {
      console.error("خطأ في الاتصال بالسيرفر:", error);
      messageBox.textContent = "حدث خطأ في الاتصال بالخادم. حاول لاحقًا.";
      messageBox.className = "error-message";
      checkBtn.disabled = false;
      checkBtn.innerText = "تحقق";
    }
  });
});

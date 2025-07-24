// رقم التحقق الافتراضي
const correctOtp = "1234"; // تأكد من أن الرقم الافتراضي هو "1234"

// الحصول على العناصر
const checkBtn = document.getElementById('check-btn');
const resendText = document.getElementById('resend-text');
const messageElement = document.getElementById('message');
const otpInputs = document.querySelectorAll('.input-otp');

// الدالة التي تتحقق من رمز التحقق
checkBtn.addEventListener('click', async () => {
  const enteredOtp = Array.from(otpInputs).map(input => input.value).join(''); // جمع القيم المدخلة في الخانات

  // إذا كان رمز التحقق صحيحًا
  if (enteredOtp === correctOtp) {
    messageElement.textContent = "مرحبًا بك في سابِق";
    messageElement.style.backgroundColor = "#d4edda9c"; // اللون الأخضر
    messageElement.style.color = "#155724";
    messageElement.style.display = 'block'; // عرض الرسالة

    // التحقق من التوكن والدور بعد التحقق من رمز OTP
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // إرسال طلب التحقق من الدور إلى السيرفر
        const response = await fetch("http://localhost:3000/auth/role", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        const data = await response.json();

        if (response.ok) {

             if (enteredOtp === correctOtp) {
    messageElement.textContent = "مرحبًا بك في سابِق";
    messageElement.style.backgroundColor = "#d4edda9c"; // اللون الأخضر
    messageElement.style.color = "#155724";
    messageElement.style.display = 'block'; // عرض الرسالة
             }
          // إعادة التوجيه حسب الدور
          setTimeout(() => {
            switch (data.role) {
              case "فني":
                window.location.href = "technician-dashboard.html"; // التوجيه إلى صفحة الفني
                break;
              case "مشرف صيانة":
                window.location.href = "supervisor-dashboard.html"; // التوجيه إلى صفحة مشرف الصيانة
                break;
              case "مدير عمليات":
                window.location.href = "dashboard.html"; // التوجيه إلى صفحة مدير العمليات
                break;
              default:
                messageElement.textContent = "الدور غير معروف";
                messageElement.className = "error-message";
                messageElement.style.display = 'block'; // عرض رسالة الخطأ
            }
          }, 1500); // تأخير 1.5 ثانية قبل التوجيه
        } else {
          messageElement.textContent = `${data.message}`;
          messageElement.className = "error-message";
          messageElement.style.display = 'block'; // عرض رسالة الخطأ
        }
      } catch (error) {
        console.error("خطأ في الاتصال بالسيرفر:", error);
        messageElement.textContent = "حدث خطأ في الاتصال بالخادم. حاول لاحقًا.";
        messageElement.className = "error-message";
        messageElement.style.display = 'block'; // عرض رسالة الخطأ
      }
    }
  } else {
    messageElement.textContent = "رمز التحقق غير صحيح";
    messageElement.style.backgroundColor = "#f8d7daa1"; // اللون الأحمر
    messageElement.style.color = "#721c24";
    messageElement.style.display = 'block'; // عرض الرسالة
  }
});

// وظيفة لإظهار "إعادة إرسال رمز التحقق" بعد 60 ثانية
let countdown = 60;
let resendTimeout;

function enableResendButton() {
  resendText.style.display = 'block';
  resendText.addEventListener('click', resendOtp);
}

function resendOtp() {
  // إخفاء زر إعادة الإرسال بعد النقر عليه
  resendText.style.display = 'none';
  messageElement.textContent = "تم إرسال رمز التحقق مرة أخرى";
  messageElement.style.backgroundColor = "#d4edda9c"; // اللون الأخضر
  messageElement.style.color = "#155724";
  messageElement.style.display = 'block';

  // إلغاء العداد القديم وبدء العد من جديد
  clearInterval(resendTimeout);
  countdown = 60;
  startCountdown();
}

function startCountdown() {
  resendTimeout = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(resendTimeout);
      enableResendButton();
    }
  }, 1000);
}

// بدء العد التنازلي فور تحميل الصفحة
startCountdown();

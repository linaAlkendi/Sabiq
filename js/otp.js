// رقم التحقق الافتراضي
const correctOtp = "1234";

// الحصول على العناصر
const checkBtn = document.getElementById('check-btn');
const resendText = document.getElementById('resend-text');
const messageElement = document.getElementById('message');
const otpInputs = document.querySelectorAll('.input-otp');

// الدالة التي تتحقق من رمز التحقق
checkBtn.addEventListener('click', () => {
  const enteredOtp = Array.from(otpInputs).map(input => input.value).join('');

  if (enteredOtp === correctOtp) {
    messageElement.textContent = "مرحبًا بك في سابق";
    messageElement.style.backgroundColor = "#d4edda9c"; // اللون الأخضر
    messageElement.style.color = "#155724";
  } else {
    messageElement.textContent = "رمز التحقق غير صحيح";
    messageElement.style.backgroundColor = "#f8d7daa1"; // اللون الأحمر
    messageElement.style.color = "#721c24";
  }

  messageElement.style.display = 'block';
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

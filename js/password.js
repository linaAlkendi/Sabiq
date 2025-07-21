const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const currentPasswordInput = document.getElementById('current-password');
const saveBtn = document.getElementById('saveBtn');
const passwordCriteria = document.getElementById('password-criteria');
const messageArea = document.getElementById('message-area'); // مكان عرض الرسالة

const defaultPassword = "Ahmed@123872";

// معايير كلمة المرور
passwordCriteria.innerHTML = `
  <ul>
    <li id="upperCase" class="criteria-item">يجب أن تحتوي على حروف كبيرة وصغيرة</li>
    <li id="numbers" class="criteria-item">يجب أن تحتوي على أرقام</li>
    <li id="symbols" class="criteria-item">يجب أن تحتوي على رموز خاصة</li>
    <li id="length" class="criteria-item">يجب أن تحتوي على 12 حرفًا على الأقل</li>
    <li id="unDecipherable" class="criteria-item">يجب أن تكون عبارة غير قابلة للفك</li>
  </ul>
`;

function validatePassword() {
  const password = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  let validationMessage = '';

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  if (hasUpperCase && hasLowerCase) {
    document.getElementById('upperCase').classList.add('valid');
    document.getElementById('upperCase').classList.remove('invalid');
  } else {
    document.getElementById('upperCase').classList.add('invalid');
    document.getElementById('upperCase').classList.remove('valid');
    validationMessage += "يجب أن تحتوي على حروف كبيرة وصغيرة.\n";
  }

  const hasNumbers = /\d/.test(password);
  if (hasNumbers) {
    document.getElementById('numbers').classList.add('valid');
    document.getElementById('numbers').classList.remove('invalid');
  } else {
    document.getElementById('numbers').classList.add('invalid');
    document.getElementById('numbers').classList.remove('valid');
    validationMessage += "يجب أن تحتوي على أرقام.\n";
  }

  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (hasSymbols) {
    document.getElementById('symbols').classList.add('valid');
    document.getElementById('symbols').classList.remove('invalid');
  } else {
    document.getElementById('symbols').classList.add('invalid');
    document.getElementById('symbols').classList.remove('valid');
    validationMessage += "يجب أن تحتوي على رموز خاصة.\n";
  }

  const isLongEnough = password.length >= 12;
  if (isLongEnough) {
    document.getElementById('length').classList.add('valid');
    document.getElementById('length').classList.remove('invalid');
  } else {
    document.getElementById('length').classList.add('invalid');
    document.getElementById('length').classList.remove('valid');
    validationMessage += "يجب أن تحتوي على 12 حرفًا على الأقل.\n";
  }

  const commonPasswords = /password|12345|qwerty|abc123|welcome|letmein|password123|123123|iloveyou|monkey/i;
  const isDecipherable = commonPasswords.test(password); 
  if (isDecipherable) {
    document.getElementById('unDecipherable').classList.add('invalid');
    document.getElementById('unDecipherable').classList.remove('valid');
    validationMessage += "يجب أن تكون عبارة غير قابلة للفك.\n";
  } else {
    document.getElementById('unDecipherable').classList.add('valid');
    document.getElementById('unDecipherable').classList.remove('invalid');
  }

  // تحقق من تطابق كلمة المرور الجديدة مع كلمة المرور المؤكدة
  if (newPasswordInput.value !== confirmPasswordInput.value) {
    document.getElementById('confirmPassword').classList.add('invalid');
    document.getElementById('confirmPassword').classList.remove('valid');
    validationMessage += "كلمة المرور الجديدة لا تتطابق مع التأكيد.\n";
  } else {
    document.getElementById('confirmPassword').classList.add('valid');
    document.getElementById('confirmPassword').classList.remove('invalid');
  }

  // عرض رسالة التنبيه بدلاً من تعطيل الزر
  if (validationMessage) {
    messageArea.textContent = validationMessage;
    saveBtn.disabled = true;
  } else {
    messageArea.textContent = ''; // إخفاء الرسائل إذا كانت الشروط مستوفاة
    saveBtn.disabled = false;
  }
}

function saveChanges() {
  const currentPassword = currentPasswordInput.value;

  if (currentPassword !== defaultPassword) {
    showErrorPopup("كلمة المرور الحالية خاطئة!");
  } else {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
      showErrorPopup("كلمة المرور الجديدة غير متطابقة!");
    } else {
      showSuccessPopup("تم تحديث كلمة المرور بنجاح!");
    }
  }
}

function showSuccessPopup(message) {
  const popup = document.getElementById("successPopup");
  const msg = document.getElementById("successMessage");

  msg.textContent = message || "تم تحديث كلمة المرور بنجاح!";
  popup.style.display = "flex";

  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

function showErrorPopup(message) {
  const popup = document.getElementById("errorPopup");
  const msg = document.getElementById("errorMessage");

  msg.textContent = message || "كلمة المرور الحالية خاطئة!";
  popup.style.display = "flex";

  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

newPasswordInput.addEventListener('input', validatePassword);
confirmPasswordInput.addEventListener('input', validatePassword);
saveBtn.addEventListener('click', saveChanges);

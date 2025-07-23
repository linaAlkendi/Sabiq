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

// دالة التحقق من كلمة المرور
function validatePassword() {
  const password = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  let validationMessage = '';
  let allCriteriaMet = true;  // Flag للتحقق من استيفاء جميع الشروط

  // تحقق من وجود الحروف الكبيرة والصغيرة
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  if (hasUpperCase && hasLowerCase) {
    document.getElementById('upperCase').classList.add('valid');
    document.getElementById('upperCase').classList.remove('invalid');
  } else {
    document.getElementById('upperCase').classList.add('invalid');
    document.getElementById('upperCase').classList.remove('valid');
    validationMessage += "يجب أن تحتوي على حروف كبيرة وصغيرة.\n";
    allCriteriaMet = false;
  }

  // تحقق من وجود الأرقام
  const hasNumbers = /\d/.test(password);
  if (hasNumbers) {
    document.getElementById('numbers').classList.add('valid');
    document.getElementById('numbers').classList.remove('invalid');
  } else {
    document.getElementById('numbers').classList.add('invalid');
    document.getElementById('numbers').classList.remove('valid');
    validationMessage += "يجب أن تحتوي على أرقام.\n";
    allCriteriaMet = false;
  }

  // تحقق من وجود الرموز الخاصة
  const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (hasSymbols) {
    document.getElementById('symbols').classList.add('valid');
    document.getElementById('symbols').classList.remove('invalid');
  } else {
    document.getElementById('symbols').classList.add('invalid');
    document.getElementById('symbols').classList.remove('valid');
    validationMessage += "يجب أن تحتوي على رموز خاصة.\n";
    allCriteriaMet = false;
  }

  // تحقق من طول كلمة المرور
  const isLongEnough = password.length >= 12;
  if (isLongEnough) {
    document.getElementById('length').classList.add('valid');
    document.getElementById('length').classList.remove('invalid');
  } else {
    document.getElementById('length').classList.add('invalid');
    document.getElementById('length').classList.remove('valid');
    validationMessage += "يجب أن تحتوي على 12 حرفًا على الأقل.\n";
    allCriteriaMet = false;
  }

  // تحقق من أن كلمة المرور غير قابلة للفك
  const commonPasswords = /password|12345|qwerty|abc123|welcome|letmein|password123|123123|iloveyou|monkey/i;
  const isDecipherable = commonPasswords.test(password); 
  if (isDecipherable) {
    document.getElementById('unDecipherable').classList.add('invalid');
    document.getElementById('unDecipherable').classList.remove('valid');
    validationMessage += "يجب أن تكون عبارة غير قابلة للفك.\n";
    allCriteriaMet = false;
  } else {
    document.getElementById('unDecipherable').classList.add('valid');
    document.getElementById('unDecipherable').classList.remove('invalid');
  }

  // تحقق من تطابق كلمة المرور الجديدة مع كلمة المرور المؤكدة
  if (newPasswordInput.value !== confirmPasswordInput.value) {
    document.getElementById('confirmPassword').classList.add('invalid');
    document.getElementById('confirmPassword').classList.remove('valid');
    validationMessage += "كلمة المرور الجديدة لا تتطابق مع التأكيد.\n";
    allCriteriaMet = false;
  } else {
    document.getElementById('confirmPassword').classList.add('valid');
    document.getElementById('confirmPassword').classList.remove('invalid');
  }

  // عرض الرسائل أو إخفائها
  if (validationMessage) {
    messageArea.style.display = 'block';
    messageArea.textContent = validationMessage;
  } else {
    messageArea.style.display = 'none'; // إخفاء الرسائل إذا كانت الشروط مستوفاة
  }

  return allCriteriaMet;
}








// إضافة حدث للمستمع
newPasswordInput.addEventListener('input', validatePassword);
confirmPasswordInput.addEventListener('input', validatePassword);
saveBtn.addEventListener('click', saveChanges);
let originalValues = {};

function enableField(field) {
  const inputField = document.getElementById(field);
  if (inputField) {
    originalValues[field] = inputField.textContent;
    inputField.contentEditable = true;
    inputField.style.backgroundColor = "#fff";
    inputField.style.textAlign = "center";
    inputField.focus();
  }
}

function validateInputs() {
  const email = document.getElementById('email').textContent;
  const phone = document.getElementById('phone').textContent.trim();
  let errorMessage = '';

  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailPattern.test(email)) {
    errorMessage = "📧 البريد الإلكتروني يجب أن يكون في صيغة صحيحة gmail.com@";
  }

  if (!errorMessage) {
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      errorMessage = "📱 رقم الهاتف يجب أن يتكون من 10 أرقام فقط وبدون رموز!";
    }
  }

  if (!errorMessage && phone.length !== 10) {
    errorMessage = "📱 رقم الهاتف يجب أن يتكون من 10 خانات فقط.";
  }

  if (errorMessage) {
    showErrorText(errorMessage);
    return false;
  }

  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.style.display = "none";
  
  return true;
}

function showErrorText(message) {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.textContent = message;
  errorMessageElement.style.color = "#e74c3c";
  errorMessageElement.style.backgroundColor = "#f8d7da";
  errorMessageElement.style.padding = "10px";
  errorMessageElement.style.borderRadius = "10px";
  errorMessageElement.style.fontWeight = "bold";
  errorMessageElement.style.fontSize = "16px";
  errorMessageElement.style.textAlign = "center";
  errorMessageElement.style.display = "block";

  setTimeout(() => {
    errorMessageElement.style.display = "none";
  }, 3000);
}

function saveChanges() {
  const errorMessageElement = document.getElementById("errorMessage");
  errorMessageElement.style.display = "none";

  if (validateInputs()) {
    showConfirmationPopup("هل أنت متأكد من حفظ التعديلات؟", () => {
      const email = document.getElementById('email').textContent;
      const phone = document.getElementById('phone').textContent;

      console.log('Email:', email);
      console.log('Phone:', phone);
    });
  }
}

function showConfirmationPopup(message, onConfirm) {
  const popup = document.getElementById("confirmPopup");
  const msg = popup.querySelector(".confirm-message");
  const yesBtn = document.getElementById("confirmYes");
  const noBtn = document.getElementById("confirmNo");

  msg.textContent = message;
  popup.style.display = "flex";

  yesBtn.onclick = () => {
    popup.style.display = "none";
    onConfirm();
  };

  noBtn.onclick = () => {
    const fieldsToReset = Object.keys(originalValues);
    fieldsToReset.forEach(field => {
      const inputField = document.getElementById(field);
      if (inputField) {
        inputField.textContent = originalValues[field];
        inputField.style.backgroundColor = "";
        inputField.contentEditable = false;
      }
    });
    popup.style.display = "none";
  };
}

// فلترة التنبيهات
    document.getElementById("filterType").addEventListener("change", function () {
      const value = this.value;
      document.querySelectorAll(".alert-card").forEach(card => {
        card.style.display = (value === "all" || card.classList.contains(value)) ? "block" : "none";
      });
    });

    // بحث بالكلمات
    document.getElementById("searchInput").addEventListener("input", function () {
      const val = this.value.toLowerCase();
      document.querySelectorAll(".alert-card").forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(val) ? "block" : "none";
      });
    });

  // زر رفع بلاغ
document.querySelectorAll('.btn-report').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = 'new-report.html';
  });
});

// أزرار تمت قراءته مع pop-up تأكيد الحذف
document.querySelectorAll('.btn-dismiss').forEach(btn => {
  btn.addEventListener('click', () => {
    const alertCard = btn.closest('.alert-card');
    showConfirmPopup(
      'هل ترغب بحذف التنبيه؟',
      () => {
        alertCard.remove();
        updateUnreadCount();
        closeConfirmPopup();
      },
      () => {
        closeConfirmPopup();
      }
    );
  });
    });

// إنشاء عناصر النافذة المنبثقة وإضافتها للصفحة (تم تضمينها في HTML)
// هنا فقط تعريف الدوال:

function showConfirmPopup(message, onYes, onNo) {
  const popup = document.getElementById('confirmPopup');
  popup.querySelector('.confirm-message').textContent = message;
  popup.style.display = 'flex';

  const yesBtn = document.getElementById('confirmYes');
  const noBtn = document.getElementById('confirmNo');

  function cleanup() {
    yesBtn.removeEventListener('click', yesHandler);
    noBtn.removeEventListener('click', noHandler);
    popup.style.display = 'none';
  }
  function yesHandler() {
    cleanup();
    onYes();
  }
  function noHandler() {
    cleanup();
    onNo();
  }
  yesBtn.addEventListener('click', yesHandler);
  noBtn.addEventListener('click', noHandler);
}

function closeConfirmPopup() {
  const popup = document.getElementById('confirmPopup');
  popup.style.display = 'none';
}
// عناصر الواجهة
const video = document.getElementById('ar-video');
const modalOverlay = document.getElementById('modal-overlay');
const closeBtn = document.getElementById('close-btn');
const modalClose = document.getElementById('modal-close');
const actionBtn = document.getElementById('action-btn');
const detailsBtn = document.getElementById('details-btn');
const loadingOverlay = document.getElementById('loading-overlay');

// بيانات المرافق الوهمية
const facilitiesData = {
  "FAC-001": {
    name: "المصعد رقم 2 - الجناح الشمالي",
    status: "warning",
    lastMaintenance: "10 نوفمبر 2024",
    usageCount: "1,245 (85% من الحد الأقصى)",
    nextPrediction: "عطل ميكانيكي محتمل خلال 5 أيام (82%)",
    advice: "1. تفقد حزام المحرك الرئيسي<br>2. فحص نظام الفرامل<br>3. تزيين القضبان المتحركة",
    estimatedTime: "45 دقيقة",
    commonIssues: ["اهتراء الأحزمة", "مشاكل في المستشعرات", "ضغط زائد"]
  },
  "FAC-002": {
    name: "البوابة الإلكترونية رقم 5 - المدخل الرئيسي",
    status: "normal",
    lastMaintenance: "5 ديسمبر 2024",
    usageCount: "892 (60% من الحد الأقصى)",
    nextPrediction: "لا توجد تنبؤات بعطل قريب",
    advice: "1. تنظيف مستشعرات الحركة<br>2. فحص بطارية النسخ الاحتياطي<br>3. اختبار آلية الفتح/الإغلاق",
    estimatedTime: "30 دقيقة",
    commonIssues: ["مشاكل في المستشعرات", "تعطل البطارية", "أعطال في لوحة التحكم"]
  },
  "FAC-003": {
    name: "السلم المتحرك رقم 1 - الطابق الأرضي",
    status: "danger",
    lastMaintenance: "15 أكتوبر 2024",
    usageCount: "1,780 (95% من الحد الأقصى)",
    nextPrediction: "عطل كهربائي محتمل خلال يومين (91%)",
    advice: "1. فحص لوحة التحكم الكهربائية<br>2. تفقد المحرك الكهربائي<br>3. اختبار نظام الأمان",
    estimatedTime: "60 دقيقة",
    commonIssues: ["مشاكل في المحرك", "أعطال كهربائية", "اهتراء الدرجات"]
  }
};

// بدء الكاميرا ومسح الباركود
async function startBarcodeScanner() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    video.srcObject = stream;
    
    // إنشاء عنصر canvas لتحليل الباركود
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');
    
    // دورة تحليل الباركود
    function scanBarcode() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert'
        });
        
        if (code) {
          handleFacilityScan(code.data);
        } else {
          requestAnimationFrame(scanBarcode);
        }
      } else {
        requestAnimationFrame(scanBarcode);
      }
    }
    
    // بدء المسح
    scanBarcode();
    
  } catch (err) {
    alert('لا يمكن الوصول إلى الكاميرا: ' + err.message);
  }
}

// معالجة بيانات المرفق عند المسح
function handleFacilityScan(facilityId) {
  loadingOverlay.style.display = 'flex';
  
  // محاكاة جلب البيانات من الخادم
  setTimeout(() => {
    loadingOverlay.style.display = 'none';
    
    const facility = facilitiesData[facilityId];
    if (facility) {
      // تحديث بيانات الواجهة
      document.getElementById('facility-name').textContent = facility.name;
      document.getElementById('last-maintenance').textContent = facility.lastMaintenance;
      document.getElementById('usage-count').textContent = facility.usageCount;
      document.getElementById('next-prediction').textContent = facility.nextPrediction;
      document.getElementById('maintenance-advice').innerHTML = facility.advice;
      
      // تحديث حالة المرفق
      const statusElement = document.getElementById('facility-status');
      const statusText = document.getElementById('status-text');
      const statusIcon = document.getElementById('status-icon');
      
      if (facility.status === 'normal') {
        statusText.textContent = 'حالة طبيعية';
        statusIcon.className = 'fas fa-check-circle';
        statusElement.className = 'status-badge status-normal';
      } else if (facility.status === 'warning') {
        statusText.textContent = 'تحذير: يحتاج صيانة';
        statusIcon.className = 'fas fa-exclamation-triangle';
        statusElement.className = 'status-badge status-warning';
      } else {
        statusText.textContent = 'خطر: عطل وشيك';
        statusIcon.className = 'fas fa-times-circle';
        statusElement.className = 'status-badge status-danger';
      }
      
      // إظهار النافذة المنبثقة
      modalOverlay.classList.add('active');
      
      // إيقاف الكاميرا مؤقتًا عند ظهور النافذة
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    } else {
      alert('لم يتم التعرف على المرفق. الرجاء المحاولة مرة أخرى.');
      startBarcodeScanner();
    }
  }, 1500);
}

// إغلاق الواجهة الرئيسية
closeBtn.addEventListener('click', () => {
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  window.location.href = 'technician-dashboard.html';
});

// إغلاق النافذة المنبثقة
modalClose.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  startBarcodeScanner();
});

// زر بدء الصيانة
actionBtn.addEventListener('click', () => {
  alert('تم بدء إجراءات الصيانة للمرفق');
  modalOverlay.classList.remove('active');
  window.location.href = 'maintenance-start.html';
});

// زر عرض التفاصيل
detailsBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('active');
  window.location.href = 'facility-details.html';
});

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  startBarcodeScanner();
});
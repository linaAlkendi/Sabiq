document.addEventListener('DOMContentLoaded', function() {
  // إنشاء الرسوم البيانية الوهمية
  createUsageChart();
  createFailureChart();
  
  // إضافة تفاعلات للأزرار
  setupButtons();
  
  // تحميل بيانات وهمية
  loadMockData();
});

function createUsageChart() {
  const ctx = document.getElementById('usage-chart').getContext('2d');
  
  // بيانات وهمية لاستخدام المرفق
  const labels = Array.from({length: 30}, (_, i) => `${i+1}`);
  const data = labels.map(() => Math.floor(Math.random() * 100) + 20);
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'عدد مرات الاستخدام',
        data: data,
        borderColor: '#4e78aeff',
        backgroundColor: 'rgba(74, 137, 220, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#7e9ec9ff',
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          rtl: true,
          titleAlign: 'right',
          bodyAlign: 'right'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function createFailureChart() {
  const ctx = document.getElementById('failure-chart').getContext('2d');
  
  // بيانات وهمية للأعطال
  const failureTypes = ['ميكانيكي', 'كهربائي', 'أخرى'];
  const failureData = failureTypes.map(() => Math.floor(Math.random() * 50) + 10);
  const backgroundColors = [
    'rgba(168, 142, 76, 0.7)',
    'rgba(72, 148, 148, 0.7)',
    'rgba(107, 82, 158, 0.7)'
  ];
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: failureTypes,
      datasets: [{
        data: failureData,
        backgroundColor: backgroundColors,
        borderWidth: 1,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'left',
          rtl: true,
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20
          }
        },
        tooltip: {
          rtl: true,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} حالة (${percentage}%)`;
            }
          }
        }
      },
      cutout: '65%',
      animation: {
        animateScale: true,
        animateRotate: true
      }
    }
  });
}

function setupButtons() {
  // زر بدء الصيانة
  document.getElementById('start-maintenance-btn').addEventListener('click', function() {
    showNotification('تم بدء مهمة الصيانة بنجاح', 'success');
    
    // تحديث حالة المرفق
    document.getElementById('facility-status').textContent = 'قيد الصيانة';
    document.getElementById('facility-status').className = 'status-badge maintenance';
    
    // إضافة إلى سجل الصيانة
    addMaintenanceRecord();
  });
  
  // زر طلب قطع غيار
  document.getElementById('request-parts-btn').addEventListener('click', function() {
    showPartsModal();
  });
  
  // زر الإبلاغ عن عطل
  document.getElementById('report-failure-btn').addEventListener('click', function() {
    showFailureReportModal();
  });
  
  // زر QR Code
  document.getElementById('qrButton').addEventListener('click', function() {
    showQRScanner();
  });
}

function loadMockData() {
  // بيانات تنبؤ وهمية
  const failureProbability = Math.floor(Math.random() * 30) + 50;
  document.getElementById('failure-probability').textContent = `${failureProbability}% احتمال عطل`;
  
  const predictions = [
    'عطل ميكانيكي محتمل خلال 5-7 أيام بناءً على أنماط الاستخدام',
    'اهتراء في بعض المكونات يتطلب الفحص الدوري',
    'زيادة غير طبيعية في معدل الاستخدام مؤخراً',
    'حاجة إلى صيانة وقائية خلال الأسبوع القادم'
  ];
  document.getElementById('failure-prediction').textContent = predictions[Math.floor(Math.random() * predictions.length)];
  
  // تحديث وقت الإصلاح
  const repairTime = Math.floor(Math.random() * 60) + 30;
  document.getElementById('repair-time').textContent = `${repairTime} دقيقة`;
}

function addMaintenanceRecord() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  const technicians = ['خالد أحمد', 'سامي الزهراني', 'محمد السبيعي', 'محمد العتيبي'];
  const problems = ['صيانة وقائية', 'إصلاح عطل ميكانيكي', 'ضبط إعدادات', 'استبدال قطعة'];
  const actions = ['فحص شامل', 'تزييت الأجزاء', 'استبدال القطعة', 'إعادة ضبط'];
  
  const record = {
    date: dateStr,
    type: 'صيانة',
    problem: problems[Math.floor(Math.random() * problems.length)],
    action: actions[Math.floor(Math.random() * actions.length)],
    technician: technicians[Math.floor(Math.random() * technicians.length)]
  };
  
  const tbody = document.getElementById('maintenance-history');
  const row = document.createElement('tr');
  
  row.innerHTML = `
    <td>${record.date}</td>
    <td>${record.type}</td>
    <td>${record.problem}</td>
    <td>${record.action}</td>
    <td>${record.technician}</td>
  `;
  
  tbody.insertBefore(row, tbody.firstChild);
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function showPartsModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h3>طلب قطع غيار</h3>
      
      <div class="form-group">
        <label for="part-name">اسم القطعة:</label>
        <input type="text" id="part-name" placeholder="أدخل اسم القطعة المطلوبة">
      </div>
      
      <div class="form-group">
        <label for="part-quantity">الكمية:</label>
        <input type="number" id="part-quantity" min="1" value="1">
      </div>
      
      <div class="form-group">
        <label for="part-urgency">درجة الأهمية:</label>
        <select id="part-urgency">
          <option value="normal">عادية</option>
          <option value="urgent">عاجلة</option>
          <option value="critical">حرجة</option>
        </select>
      </div>
      
      <button class="btn btn-primary" id="submit-parts-request">تأكيد الطلب</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#submit-parts-request').addEventListener('click', () => {
    const partName = document.getElementById('part-name').value;
    if (partName.trim() === '') {
      alert('الرجاء إدخال اسم القطعة المطلوبة');
      return;
    }
    
    showNotification('تم إرسال طلب قطع الغيار بنجاح', 'success');
    document.body.removeChild(modal);
  });
}

function showFailureReportModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h3>إبلاغ عن عطل</h3>
      
      <div class="form-group">
        <label for="failure-type">نوع العطل:</label>
        <select id="failure-type">
          <option value="mechanical">ميكانيكي</option>
          <option value="electrical">كهربائي</option>
          <option value="other">أخرى</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="failure-description">وصف العطل:</label>
        <textarea id="failure-description" rows="4" placeholder="صف العطل بالتفصيل"></textarea>
      </div>
      
      <div class="form-group">
        <label for="failure-severity">درجة الخطورة:</label>
        <select id="failure-severity">
          <option value="low">منخفضة</option>
          <option value="medium">متوسطة</option>
          <option value="high">عالية</option>
        </select>
      </div>
      
      <button class="btn btn-danger" id="submit-failure-report">إرسال البلاغ</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#submit-failure-report').addEventListener('click', () => {
    const description = document.getElementById('failure-description').value;
    if (description.trim() === '') {
      alert('الرجاء إدخال وصف العطل');
      return;
    }
    
    showNotification('تم إرسال بلاغ العطل بنجاح', 'success');
    document.body.removeChild(modal);
    
    // تحديث حالة المرفق
    document.getElementById('facility-status').textContent = 'عطل - يحتاج إصلاح';
    document.getElementById('facility-status').className = 'status-badge danger';
  });
}

function showQRScanner() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  
  modal.innerHTML = `
    <div class="modal-content qr-scanner">
      <span class="close-modal">&times;</span>
      <h3>مسح رمز QR</h3>
      
      <div class="qr-placeholder">
        <i class="fas fa-qrcode"></i>
        <p>ضع رمز QR أمام الكاميرا</p>
      </div>
      
      <div class="qr-result hidden">
        <p>تم التعرف على المرفق:</p>
        <h4>المصعد رقم 2 - الجناح الشمالي</h4>
        <p>الموقع: الجناح الشمالي - الطابق الأرضي</p>
      </div>
      
      <button class="btn btn-primary hidden" id="confirm-qr">تأكيد</button>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // محاكاة مسح QR بعد 2 ثانية
  setTimeout(() => {
    const placeholder = modal.querySelector('.qr-placeholder');
    const result = modal.querySelector('.qr-result');
    const confirmBtn = modal.querySelector('#confirm-qr');
    
    placeholder.classList.add('hidden');
    result.classList.remove('hidden');
    confirmBtn.classList.remove('hidden');
  }, 2000);
  
  modal.querySelector('.close-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#confirm-qr').addEventListener('click', () => {
    document.body.removeChild(modal);
    showNotification('تم التعرف على المرفق بنجاح', 'success');
  });
}
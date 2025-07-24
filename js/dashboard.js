fetch('http://localhost:3000/facilities')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('facilityGrid');
    data.forEach(facility => {
      const card = document.createElement('div');
      card.className = 'facility-card';

      let statusText = '';
      if (facility.status === 'danger') {
        statusText = '🔴 عطل مؤكد';
      } else if (facility.status === 'warning') {
        statusText = '⚠️ عطل محتمل';
      } else if (facility.status === 'good') {
        statusText = '✅ شغال';
      } else {
        statusText = facility.status;
      }

      let predictionText = '';
      if (facility.model_prediction === '1') {
        predictionText = '🔧 العطل متوقع (تنبؤ النموذج)';
      } else if (facility.model_prediction === '0') {
        predictionText = '✅ لا يوجد عطل (تنبؤ النموذج)';
      } else {
        predictionText = '❓ التنبؤ غير متوفر';
      }

      card.innerHTML = `
        <h3>${facility.name}</h3>
        
        <div class="facility-stats">
          <div class="stat">
            <span class="stat-label">الحرارة</span>
            <span class="stat-value">${facility.temperature}</span>
          </div>
          <div class="stat">
            <span class="stat-label">الاهتزاز</span>
            <span class="stat-value">${facility.vibration}</span>
          </div>
          <div class="stat">
            <span class="stat-label">الضغط</span>
            <span class="stat-value">${facility.pressure}</span>
          </div>
          <div class="stat">
            <span class="stat-label">الرطوبة</span>
            <span class="stat-value">${facility.humidity}</span>
          </div>
          <div class="stat">
            <span class="stat-label">حمل الموتور</span>
            <span class="stat-value">${facility.motor_load}</span>
          </div>
          <div class="stat prediction">
            <span class="stat-label">تنبؤ النموذج</span>
            <span class="stat-value">${predictionText}</span>
          </div>
        </div>

        <div class="card-actions">
          <span class="status ${facility.status}">${statusText}</span>
          <a href="details.html?id=${facility.id}" class="btn">عرض التفاصيل</a>
        </div>
      `;

      grid.appendChild(card);
    });
  })
  .catch(err => {
    console.error("خطأ في جلب بيانات المرافق:", err);
  });

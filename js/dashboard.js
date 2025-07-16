fetch('http://localhost:3000/facilities')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('facilityGrid');
    data.forEach(facility => {
      const card = document.createElement('div');
      card.className = 'facility-card';

      card.innerHTML = `
        <h3>${facility.name}</h3>
        <p class="usage">الاستخدام الحالي: ${facility.currentUsage} / ${facility.maxUsage}</p>
        
        <div class="facility-stats">
          <div class="stat">
            <span class="stat-label">الحرارة</span>
            <span class="stat-value">${facility.temperature}°C</span>
          </div>
          <div class="stat">
            <span class="stat-label">الاهتزاز</span>
            <span class="stat-value">${facility.vibration}</span>
          </div>
          <div class="stat">
            <span class="stat-label">ساعات التشغيل</span>
            <span class="stat-value">${facility.operatingHours} ساعة</span>
          </div>
        </div>

        <div class="card-actions">
          <span class="status ${facility.status}">
            ${facility.status === 'danger' ? '🔴 تدخل فوري' :
              facility.status === 'warning' ? '⚠️ قرب صيانة' : '✅ شغال'}
          </span>
          <a href="${facility.detailsPage}" class="btn">عرض التفاصيل</a>
        </div>
      `;

      grid.appendChild(card);
    });
  });

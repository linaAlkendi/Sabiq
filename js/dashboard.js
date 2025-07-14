fetch('http://localhost:3000/facilities')
  .then(response => response.json())
  .then(data => {
    const grid = document.getElementById('facilityGrid');
    data.forEach(facility => {
      const card = document.createElement('div');
      card.className = 'facility-card';

      card.innerHTML = `
          <h3>${facility.name}</h3>
          <p class="usage">${facility.currentUsage} / ${facility.maxUsage} استخدام</p>
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

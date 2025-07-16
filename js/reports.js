
fetch("http://localhost:3000/incidents")
  .then(res => res.json())
  .then(incidents => {
    renderIncidents(incidents);
  })
  .catch(error => {
    console.error("Failed to fetch incidents:", error);
  });


function renderIncidents(list) {
  const container = document.getElementById('incident-list');
  container.innerHTML = '';

  list.forEach(incident => {
    const card = document.createElement('div');

    function getStatusBadge(status) {
      const statusMap = {
        open: `
      <span class="status-badge status-open">
        <span class="status-dot"></span> بلاغ جديد
      </span>`,
        closed: `
      <span class="status-badge status-closed">
        <span class="status-dot"></span> مغلق
      </span>`,
        converted: `
      <span class="status-badge status-converted">
        <span class="status-dot"></span> عطل
      </span>`,
      };

      return statusMap[status.toLowerCase()] || '';
    }


    const badge = getStatusBadge(incident.status);

    card.className = `incident-card ${incident.severity}`;

    card.innerHTML = `
      <div><span class="label">📍 اسم المرفق:</span> <span class="value">${incident.facility}</span></div>
      <div><span class="label">🔧 نوع المشكلة:</span> <span class="value">${incident.issueType}</span></div>
      <div><span class="label">📝 وصف المشكلة:</span> <span class="value">${incident.description}</span></div>
      <div><span class="label">👤 المُبلّغ:</span> <span class="value">${incident.reportedBy}</span></div>
      <div><span class="label">🕒 وقت البلاغ:</span> <span class="value">${incident.reportedAt}</span></div>
      <div><strong>الحالة:</strong> ${badge}</div>
      <div class="incident-action">
        <label for="actionSelect">الإجراء:</label>
        <select class="action-select">
          <option disabled selected>اختر إجراء</option>
          <option value="malfunction">تحويل إلى عطل</option>
          <option value="close">إغلاق</option>
        </select>
        <button class="confirm-action-btn">تأكيد</button>
      </div>
      `;

    container.appendChild(card);
  });
}

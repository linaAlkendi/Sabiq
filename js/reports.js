
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

    // Arabic label based on status
    const statusLabel = incident.status === "resolved" ? "تم الحل" : "قيد المعالجة";

    // Apply dynamic card class based on status
    card.className = `incident-card ${incident.status}`;

    card.innerHTML = `
      <div><span class="label">📍 اسم المرفق:</span> <span class="value">${incident.facility}</span></div>
      <div><span class="label">🔧 نوع المشكلة:</span> <span class="value">${incident.issueType}</span></div>
      <div><span class="label">📝 وصف المشكلة:</span> <span class="value">${incident.description}</span></div>
      <div><span class="label">👤 المُبلّغ:</span> <span class="value">${incident.reportedBy}</span></div>
      <div><span class="label">🕒 وقت البلاغ:</span> <span class="value">${incident.reportedAt}</span></div>
      <div><span class="label">📌 الحالة:</span> <span class="value status-${incident.status}">${statusLabel}</span></div>
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

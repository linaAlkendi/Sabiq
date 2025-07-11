
let incidents = Database.loadIncidents();

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
    `;

    container.appendChild(card);
  });
}

renderIncidents(incidents);

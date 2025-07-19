
fetch("http://localhost:3000/incidents")
  .then(res => res.json())
  .then(incidents => {
    renderIncidents(incidents);
  })
  .catch(error => {
    console.error("Failed to fetch incidents:", error);
  });

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

  return statusMap[status.toLowerCase()] || "";
}

function renderIncidents(list) {
  const container = document.getElementById("incident-list");
  container.innerHTML = "";

  list.forEach((incident) => {
    const card = document.createElement("div");

    const badge = getStatusBadge(incident.status);

    card.className = `incident-card ${incident.severity}`;
    card.id = `incident-${incident.id}`; // ✅ So we can access it later

    card.innerHTML = `
      <div><span class="label">📍 اسم المرفق:</span> <span class="value">${incident.facility}</span></div>
      <div><span class="label">🔧 نوع المشكلة:</span> <span class="value">${incident.issueType}</span></div>
      <div><span class="label">📝 وصف المشكلة:</span> <span class="value">${incident.description}</span></div>
      <div><span class="label">👤 المُبلّغ:</span> <span class="value">${incident.reportedBy}</span></div>
      <div><span class="label">🕒 وقت البلاغ:</span> <span class="value">${incident.reportedAt}</span></div>
      <div><strong>الحالة:</strong> <span class="badge-container">${badge}</span></div>
      <div class="incident-action">
        <label for="actionSelect">الإجراء:</label>
        <select class="action-select">
          <option disabled selected>اختر إجراء</option>
          <option value="converted">تحويل إلى عطل</option>
          <option value="closed">إغلاق</option>
        </select>
        <button class="confirm-action-btn" data-id="${incident.id}">تأكيد</button>
      </div>
    `;

    container.appendChild(card);
  });

  // ✅ Attach handlers to the action buttons after rendering
  document.querySelectorAll(".confirm-action-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const incidentId = btn.dataset.id;
      const select = btn.previousElementSibling;
      const selectedValue = select.value;

      if (!["converted", "closed"].includes(selectedValue)) {
        alert("يرجى اختيار إجراء صالح");
        return;
      }

      const updated = await updateIncidentStatus(incidentId, selectedValue);
      if (updated) {
        const badgeContainer = document.querySelector(`#incident-${incidentId} .badge-container`);
        if (badgeContainer) {
          badgeContainer.innerHTML = getStatusBadge(updated.status);
        }
      }
    });
  });
}


async function updateIncidentStatus(id, status) {
  try {
    const res = await fetch(`http://localhost:3000/incidents/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Status update failed");
    const data = await res.json();
    return data.incident;
  } catch (err) {
    console.error(err);
    alert("خطأ في تحديث الحالة");
    return null;
  }
}


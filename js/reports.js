// Format date for display
function formatDateTime(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // fallback to raw string
  return date.toLocaleString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Riyadh" // Adjust to KSA timezone
  });
}

fetch("http://localhost:3000/incidents")
  .then((res) => res.json())
  .then((incidents) => {
    renderIncidents(incidents);
  })
  .catch((error) => {
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
    card.id = `incident-${incident.id}`;

    let actionOptions = `
  <option disabled selected>اختر إجراء</option>
  <option value="converted">تحويل إلى عطل</option>
  <option value="closed">إغلاق</option>`;

    if (incident.status === "converted") {
      // Only show 'Close'
      actionOptions = `
    <option disabled selected>اختر إجراء</option>
    <option value="closed">إغلاق</option>`;
    }

    card.innerHTML = `
      <div><span class="label"><span class="material-icons">location_on</span> اسم المرفق:</span> <span class="value">${incident.facility}</span></div>
      <div><span class="label"><span class="material-icons">build</span> نوع المشكلة:</span> <span class="value">${incident.issueType}</span></div>
      <div><span class="label"><span class="material-icons">description</span> وصف المشكلة:</span> <span class="value">${incident.description}</span></div>
      <div class="facility-characteristics">
        <p>🌡️ <strong>درجة الحرارة:</strong> ${incident.temperature ?? '—'}°C</p>
        <p>📈 <strong>مستوى الاهتزاز:</strong> ${incident.vibration ?? '—'}</p>
        <p>⚙️ <strong>الاستخدام:</strong> ${incident.currentUsage ?? '—'} / ${incident.maxUsage ?? '—'}</p>
        <p>⏱️ <strong>ساعات التشغيل:</strong> ${incident.operatingHours ?? '—'}</p>
      </div>

      <div><span class="label"><span class="material-icons">person</span> المُبلّغ:</span> <span class="value">${incident.reportedBy}</span></div>
      <div><span class="label"><span class="material-icons">schedule</span> وقت البلاغ:</span> <span class="value">${formatDateTime(incident.reportedAt)}</span></div>

      <div><strong>الحالة:</strong> <span class="badge-container">${badge}</span></div>
      <div class="incident-action">
        <label for="actionSelect">الإجراء:</label>
        <select class="action-select">${actionOptions}</select>
        <button class="confirm-action-btn" data-id="${incident.id}">تأكيد</button>
      </div>
    `;

    // Hide action controls if closed
    if (incident.status === "closed") {
      const actionDiv = card.querySelector(".incident-action");
      if (actionDiv) actionDiv.style.display = "none";
    }

    container.appendChild(card);
  });

  document.querySelectorAll(".confirm-action-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const incidentId = btn.dataset.id;
      // Safer select lookup
      const select = btn.parentElement.querySelector("select.action-select");
      const selectedValue = select.value;

      if (!["converted", "closed"].includes(selectedValue)) {
        showErrorPopup("يرجى اختيار إجراء صالح");
        return;
      }

      const confirmMessage =
        selectedValue === "converted"
          ? "هل أنت متأكد من تحويل البلاغ إلى عطل؟"
          : "هل أنت متأكد من إغلاق البلاغ؟";

      showConfirmationPopup(confirmMessage, async () => {
        const updated = await updateIncidentStatus(incidentId, selectedValue);
        if (updated) {
          const badgeContainer = document.querySelector(
            `#incident-${incidentId} .badge-container`
          );
          if (badgeContainer) {
            badgeContainer.innerHTML = getStatusBadge(updated.status);
          }

          if (selectedValue === "converted") {
            await updateFacilityStatusByName(updated.facility, "danger");
            showSuccessPopup("تم تحويل البلاغ إلى عطل");
          } else if (selectedValue === "closed") {
            showSuccessPopup("تم إغلاق البلاغ");
          }
        }
      });
    });
  });
}

// عرض نافذة التأكيد مع رسالة وزرَي نعم ولا
function showConfirmationPopup(message, onConfirm) {
  const popup = document.getElementById("confirmPopup");
  const msg = popup.querySelector(".confirm-message");
  const yesBtn = document.getElementById("confirmYes");
  const noBtn = document.getElementById("confirmNo");

  msg.textContent = message;
  popup.style.display = "flex";

  yesBtn.onclick = () => {
    popup.style.display = "none";
    onConfirm();
  };

  noBtn.onclick = () => {
    popup.style.display = "none";
  };
}

// عرض نافذة النجاح مع زر إغلاق
function showSuccessPopup(message) {
  const popup = document.getElementById("successPopup");
  const msg = document.getElementById("successMessage");

  msg.textContent = message;
  popup.style.display = "flex";

  // إخفاء النافذة بعد 2 ثواني
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

// عرض نافذة الخطأ مع زر إغلاق
function showErrorPopup(message) {
  const popup = document.getElementById("errorPopup");
  const msg = document.getElementById("errorMessage");

  msg.textContent = message;
  popup.style.display = "flex";

  // إخفاء النافذة بعد 2 ثواني
  setTimeout(() => {
    popup.style.display = "none";
  }, 2000);
}

// تحديث حالة البلاغ
async function updateIncidentStatus(id, status) {
  try {
    const res = await fetch(`http://localhost:3000/incidents/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Status update failed");

    const data = await res.json();

    // Re-fetch and re-render updated list
    const refreshed = await fetch("http://localhost:3000/incidents");
    const updatedIncidents = await refreshed.json();
    renderIncidents(updatedIncidents);

    return data.incident;
  } catch (err) {
    console.error(err);
    showErrorPopup("حدث خطأ أثناء تحديث الحالة");
    return null;
  }
}


// تحديث حالة المرفق
async function updateFacilityStatusByName(facilityName, status) {
  try {
    const res = await fetch(`http://localhost:3000/facilities/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: facilityName, status }),
    });

    if (!res.ok) throw new Error("Facility status update failed");
    const data = await res.json();
    return data.facility;
  } catch (err) {
    console.error("Facility status update error:", err);
  }
}

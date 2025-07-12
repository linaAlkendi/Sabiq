document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      contents.forEach(c => c.classList.add("hidden"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.remove("hidden");
    });
  });

  // بيانات وهمية للمستخدمين
  const users = [
    {id:1, name:"أحمد محمد", role:"admin"},
    {id:2, name:"سارة علي", role:"user"}
  ];

  const tbody = document.getElementById("userTableBody");

  function renderTable(){
    tbody.innerHTML = "";
    users.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.name}</td>
        <td>${u.role}</td>
        <td>${u.role==="admin"?"✔️":"❌"}</td>
        <td>
          <button class="edit-btn" data-id="${u.id}">تعديل</button>
          <button class="delete-btn" data-id="${u.id}">حذف</button>
        </td>`;
      tbody.appendChild(tr);
    });
  }
  renderTable();

  document.getElementById("addUserForm").addEventListener("submit", (e)=>{
    e.preventDefault();
    const f = e.target;
    users.push({
      id: Date.now(),
      name: f.name.value,
      role: f.role.value
    });
    renderTable();
    f.reset();
    // وانتقل مباشرة لجدول الادارة:
    document.querySelector(".tab-btn[data-target='tab-manage']").click();
  });

  tbody.addEventListener("click", e => {
    const id = +e.target.dataset.id;
    if(e.target.classList.contains("delete-btn")){
      const idx = users.findIndex(u=>u.id===id);
      if(idx>-1) users.splice(idx,1), renderTable();
    } else if(e.target.classList.contains("edit-btn")){
      const u = users.find(u=>u.id===id);
      const nn = prompt("الاسم الجديد:", u.name);
      if(nn){ u.name = nn; renderTable(); }
    }
  });
});
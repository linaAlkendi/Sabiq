// technician-dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const taskContainer = document.getElementById("taskContainer");

  // بيانات المهام الحالية للفني - يمكن لاحقًا استبدالها من JSON أو API
  const tasks = [
    {
      title: "فحص مصعد A",
      facility: "المبنى الإداري",
      type: "ميكانيكي",
      status: "قيد التنفيذ",
      date: "2025-07-12"
    },
    {
      title: "إصلاح السلم الكهربائي 3",
      facility: "المبنى C",
      type: "كهربائي",
      status: "قيد التنفيذ",
      date: "2025-07-11"
    },
    {
      title: "فحص بوابة 5",
      facility: "المبنى B",
      type: "كهربائي",
      status: "قيد التنفيذ",
      date: "2025-07-10"
    }
  ];

  tasks.forEach(task => {
  const card = document.createElement("div");
  card.className = "task-card";
  card.innerHTML = `
    <div class="task-title">${task.title}</div>
    <div class="task-info">المرفق: ${task.facility}</div>
    <div class="task-info">النوع: ${task.type}</div>
    <div class="task-info">تاريخ الإسناد: ${task.date}</div>
    <div class="status">${task.status}</div>
  `;

  // التنقل إلى صفحة توثيق المهمة عند الضغط
  card.addEventListener("click", () => {
    window.location.href = "complete-task.html";
  });

  taskContainer.appendChild(card);
});

});

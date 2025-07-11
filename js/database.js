// database.js

(function () {
  const defaultIncidents = [
    {
      id: 1,
      facility: "سلم متحرك 2",
      issueType: "تسرب وقود",
      description: "تم ملاحظة تسرب خفيف من أحد أنابيب الوقود تحت السلم.",
      reportedBy: "رائد الفني",
      reportedAt: "2025-07-10 15:23",
      status: "pending"
    },
    {
      id: 2,
      facility: "بوابة A3",
      issueType: "عطل كهربائي",
      description: "انطفأت الأنوار فجأة عند مدخل البوابة، بحاجة لصيانة.",
      reportedBy: "المفتشة نورة",
      reportedAt: "2025-07-10 11:48",
      status: "resolved"
    }
  ];

  if (!localStorage.getItem("incidents")) {
    localStorage.setItem("incidents", JSON.stringify(defaultIncidents));
  }

  window.Database = {
    loadIncidents: function () {
      return JSON.parse(localStorage.getItem("incidents")) || [];
    },

    saveIncidents: function (data) {
      localStorage.setItem("incidents", JSON.stringify(data));
    },

    addIncident: function (newIncident) {
      const list = this.loadIncidents();
      list.push(newIncident);
      this.saveIncidents(list);
    }
  };
})();

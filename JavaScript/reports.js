document.addEventListener("DOMContentLoaded", () => {
  const reportType = document.getElementById("reportType");
  const dateRange = document.getElementById("dateRange");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const reportContainer = document.getElementById("reportContainer");

  generateBtn.addEventListener("click", async () => {
    const type = reportType.value;
    const range = dateRange.value;
    console.log(`Fetching: ../php/get_reports.php?type=${type}&range=${range}`);
    reportContainer.innerHTML = `<p class="loading">Loading report...</p>`;

    try {
      const res = await fetch(`../php/get_reports.php?type=${type}&range=${range}`);
      const data = await res.json();
      renderReport(data, type);
    } catch (err) {
      reportContainer.innerHTML = `<p class="error">Error loading report data.</p>`;
      console.error(err);
    }
  });

  downloadBtn.addEventListener("click", () => {
    const table = document.querySelector("#reportContainer table");
    if (!table) return alert("Generate a report first!");
    const csv = tableToCSV(table);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
  });

  function renderReport(data, type) {
    reportContainer.innerHTML = "";

    // If "all" reports
    if (type === "all") {
      for (const [key, records] of Object.entries(data)) {
        if (!records.length) continue;
        const section = document.createElement("div");
        section.innerHTML = `<h2>${key.replace("_", " ").toUpperCase()}</h2>` + generateTable(records);
        reportContainer.appendChild(section);
      }
    } else {
      if (!data[type] || !data[type].length) {
        reportContainer.innerHTML = `<p>No data found for this report.</p>`;
        return;
      }
      reportContainer.innerHTML = generateTable(data[type]);
    }
  }

  function generateTable(records) {
    const keys = Object.keys(records[0]);
    let html = `<table class="report-table"><thead><tr>`;
    keys.forEach((k) => (html += `<th>${k}</th>`));
    html += `</tr></thead><tbody>`;
    records.forEach((row) => {
      html += `<tr>`;
      keys.forEach((k) => (html += `<td>${row[k]}</td>`));
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    return html;
  }

  function tableToCSV(table) {
    const rows = [...table.querySelectorAll("tr")];
    return rows
      .map((row) => {
        const cells = [...row.querySelectorAll("th, td")];
        return cells.map((cell) => `"${cell.innerText}"`).join(",");
      })
      .join("\n");
  }
});

const userProfile = document.getElementById("userProfile");
const userDropdown = document.getElementById("userDropdown");

// Toggle dropdown open/close
userProfile.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent click from closing immediately
  userDropdown.classList.toggle("show");
  userProfile.classList.toggle("active");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!userProfile.contains(e.target)) {
    userDropdown.classList.remove("show");
    userProfile.classList.remove("active");
  }
});


//Notification dropdown for low stock alerts
document.addEventListener("DOMContentLoaded", () => {
  const notificationIcon = document.getElementById("notificationIcon");
  const dropdown = document.getElementById("notificationDropdown");
  const notificationList = document.getElementById("notificationList");
  const notificationBadge = document.getElementById("notificationBadge");

  // Toggle dropdown on click
  notificationIcon.addEventListener("click", () => {
    dropdown.classList.toggle("active");
  });

  // Fetch low stock items
  async function fetchLowStock() {
    try {
      const res = await fetch("../php/get_low_stock.php");
      const data = await res.json();

      notificationList.innerHTML = "";

      if (data.length > 0) {
        notificationBadge.style.display = "block";
        dropdown.querySelector(".no-alerts").style.display = "none";

        data.forEach(item => {
          const li = document.createElement("li");
          li.textContent = `${item.product_name} — ${item.quantity} left`;
          notificationList.appendChild(li);
        });
      } else {
        notificationBadge.style.display = "none";
        dropdown.querySelector(".no-alerts").style.display = "block";
      }
    } catch (error) {
      console.error("Error fetching low stock items:", error);
    }
  }

  fetchLowStock();
});

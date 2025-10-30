let categoryChartInstance = null;
let salesChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    fetchDashboardData();
    fetchDashboardMetrics();
});

async function fetchDashboardData() {
    try {
        const res = await fetch("../php/dashboard_data.php");
        const data = await res.json();
        console.log("Dashboard data received:", data);
        if (data.error) throw new Error(data.error);

        renderStockByCategoryChart(data.stockByCategory);
        renderSalesChart(data.salesData);
    } catch (err) {
        console.error("Error loading dashboard data:", err);
    }
}

// ---------- PIE CHART: STOCK BY CATEGORY ----------
function renderStockByCategoryChart(stockByCategory) {
    const ctx = document.getElementById("categoryChart").getContext("2d");

    const labels = stockByCategory.map(item => item.category);
    const values = stockByCategory.map(item => item.stock);
    const colors = generateColors(values.length);

    // Destroy previous chart if exists
    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: "Stock by Category",
                data: values,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,             
            plugins: {
                legend: { position: "bottom" },
                title: { display: true, text: "Stock Distribution by Category" }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 5000, // 5 seconds for long animation
                easing: 'easeInOutQuad'
            }
        }
    });
}

// ---------- BAR CHART: TOTAL SALES ----------
function renderSalesChart(salesData) {
    const ctx = document.getElementById("salesChart").getContext("2d");

    const labels = salesData.map(item => item.date);
    const values = salesData.map(item => item.sales);

     // Destroy previous chart if exists
    if (salesChartInstance) salesChartInstance.destroy();

    salesChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Total Sales (KSh)",
                data: values,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,            
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: "Sales (KSh)" }
                },
                x: {
                    title: { display: true, text: "Date" }
                }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: "Total Sales Over Time" }
            },
            animation: {
                easing: 'easeInOutQuad',
                duration: 5000, 
                delay: function(context) {
                    return context.dataIndex * 500
                }
            }
        }
    });
}

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


// ---------- Helper: Generate Random Colors ----------
function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }
    return colors;
}

async function fetchDashboardMetrics() {
    try {
        const res = await fetch("../php/dashboard_metrics.php");
        const data = await res.json();

        if (data.error) throw new Error(data.error);

        updateDashboardMetrics(data.totalStock, data.lowStock);
    } catch (err) {
        console.error("Error loading dashboard metrics:", err);
    }
}

function updateDashboardMetrics(totalStock, lowStock) {
    // Find the metric value elements in order
    const metricValues = document.querySelectorAll(".metric-value");

    if (metricValues.length >= 2) {
        metricValues[0].textContent = totalStock.toLocaleString(); // Total products
        metricValues[1].textContent = lowStock.toLocaleString();   // Low stock alerts
    }
}

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


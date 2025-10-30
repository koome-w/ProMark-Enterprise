document.addEventListener("DOMContentLoaded", () => {
  fetchStockAlerts();
});

const modal = document.getElementById("restockModal");
const modalTitle = document.getElementById("modalTitle");
const form = document.getElementById("restockForm");

let allAlerts = [];

async function fetchStockAlerts() {
  try {
    const res = await fetch("../php/get_stockalert.php");
    allAlerts = await res.json();
    console.log("All alerts loaded:", allAlerts);
    renderAlertTable(allAlerts);
    updateSummaryCards(allAlerts);
  } catch (err) {
    console.error("Error fetching alerts:", err);
  }
}

function renderAlertTable(allAlerts) {
  const tbody = document.querySelector("#alertsTable tbody");
  tbody.innerHTML = "";

  allAlerts.forEach((item) => {
    const tr = document.createElement("tr");
    const priorityIcon =
      item.priority === "Critical"
        ? `<i class="fas fa-times-circle text-red"></i>`
        : `<i class="fas fa-exclamation-triangle text-yellow"></i>`;

    tr.innerHTML = `
      <td><input type="checkbox" class="select-product" data-id="${item.product_id}"></td>
      <td>${priorityIcon} ${item.priority}</td>
      <td>${item.product_name}</td>
      <td>${item.current_stock}</td>
      <td>${item.reorder_level}</td>
      <td>${item.reorder_level * 4}</td>
      <td>${item.supplier}</td>
      <td>${item.date_triggered ?? "—"}</td>
      <td>
          <button class="btn-primary" onclick="openModal(${item.product_id})">
             Restock
          </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


// Open modal
function openModal(productId) {
  const product = allAlerts.find(item => item.product_id == productId);
  if (!product) return alert("Product not found");

  modal.style.display = "flex";
  modalTitle.textContent = "Restock Product";
  form.reset();

  document.getElementById("product_id").value = product.product_id;
  document.getElementById("product_name").value = product.product_name;
  document.getElementById("current_stock").value = product.current_stock;
  document.getElementById("quantity_added").value = "";
  document.getElementById("supplier").value = product.supplier || "";
}

// Close modal
function closeModal() {
  modal.style.display = "none";
}

// Confirm restock
async function confirmRestock() {
  const productId = document.getElementById("product_id").value;
  const restockQty = parseInt(document.getElementById("quantity_added").value);
  const supplier = document.getElementById("supplier").value;

  if (!productId || isNaN(restockQty) || restockQty <= 0) {
    alert("Please enter a valid restock quantity.");
    return;
  }

  try {
    const res = await fetch("../php/restock_product.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, restock_qty: restockQty, supplier }),
    });

    const result = await res.json();
    console.log(result);

    if (result.success) {
      alert(result.message);
      closeModal();
      fetchStockAlerts(); // reload alerts if available
    } else {
      alert("Failed to restock: " + result.message);
    }
  } catch (err) {
    console.error("Error while restocking:", err);
    alert("An error occurred while processing the restock.");
  }
}

// ✅ Optional: close modal when clicking outside
window.onclick = function (event) {
  if (event.target === modal) {
    closeModal();
  }
};

//Card Summary Update
function updateSummaryCards(allAlerts) {
  const total = allAlerts.length;
  const critical = allAlerts.filter((a) => a.priority.toLowerCase() === "critical").length;
  const low = allAlerts.filter((a) => a.priority.toLowerCase() === "low").length;
  const pending = allAlerts.filter((a) => a.alert_status.toLowerCase() === "pending").length;

  console.log("Total:", total, "Critical:", critical, "Low:", low, "Pending:", pending);

  document.getElementById("alertCount").textContent = total;
  document.getElementById("criticalCount").textContent = critical;
  document.getElementById("lowStockCount").textContent = low;
  document.getElementById("pendingOrdersCount").textContent = pending;
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


// Apply search, filter, and sort
function applyFilters() {
  const search = document.getElementById("alertSearch").value.toLowerCase();
  const type = document.getElementById("alertTypeFilter").value;
  const sort = document.getElementById("sortFilter").value;

  let filtered = allAlerts.filter((alert) =>
    alert.product_name.toLowerCase().includes(search)
  );

  // Filter by type
  if (type === "low-stock") {
    filtered = filtered.filter((a) => a.priority.toLowerCase() === "low");
  } else if (type === "out-of-stock") {
    filtered = filtered.filter((a) => a.current_stock <= 0);
  }

  // Sort
  if (sort === "priority") {
    filtered.sort((a, b) => a.priority.localeCompare(b.priority));
  } else if (sort === "stock") {
    filtered.sort((a, b) => a.current_stock - b.current_stock);
  }

  renderAlertTable(filtered);
}

// === Event listeners ===
document.getElementById("alertSearch").addEventListener("input", applyFilters);
document.getElementById("alertTypeFilter").addEventListener("change", applyFilters);
document.getElementById("sortFilter").addEventListener("change", applyFilters);




// INITIALIZE PAGE
fetchStockAlerts();

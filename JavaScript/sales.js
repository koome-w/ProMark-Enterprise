const tbody = document.getElementById('salesTableBody');
const modal = document.getElementById("saleModal");
const modalTitle = document.getElementById("modalTitle");
const form = document.getElementById("saleForm");

//Fetch all products
async function fetchSales() {
  const res = await fetch("../php/sales.php");
  const data = await res.json();
  renderTable(data);
}

//Render table rows
function renderTable(data) {
  tbody.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `      
      <td>${item.product_name}</td>
      <td>${item.quantity_sold}</td>
      <td>${item.price}</td>
      <td>${item.total_amount}</td>
      <td>${item.recorded_by}</td>
      <td>${item.sales_date}</td>      
      <td>
        <button class="action-btn" onclick="editProduct(${item.sales_id})">
          <i class="fas fa-edit"></i>
        </button>
        <!--
        <button class="action-btn danger" onclick="deleteProduct(${item.sales_id})">
          <i class="fas fa-trash"></i>
        </button>
        -->
      </td>
    `;
    tbody.appendChild(row);
  });
}

//Open modal
function openModal() {
  modal.style.display = "flex";
  modalTitle.textContent = "Add New Sale";
  form.reset();
  document.getElementById("productSelect").value = "";
}

//Close modal
function closeModal() {
  modal.style.display = "none";
}

//Add new sale functionalities

document.getElementById("newSaleBtn").addEventListener("click", openModal);
document.getElementById("closeSaleModal").addEventListener("click", closeModal);
// Wait until the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadProducts(); // Call the function when the page loads
});

// Reference to the dropdown
const productSelect = document.getElementById("productSelect");
const quantityInput = document.getElementById("quantity");
const unitPriceInput = document.getElementById("unitPrice");
const totalAmountInput = document.getElementById("totalAmount");
const recordedByInput = document.getElementById("recordedBy");
const saleDateInput = document.getElementById("saleDate");
const saveSaleBtn = document.getElementById("saveSale");

let products = [];

// Function to load all products from backend
async function loadProducts() {
  try {
    const res = await fetch("../php/get_products.php");
    if (!res.ok) throw new Error("Failed to fetch products");

    products = await res.json();
    console.log("Loaded products:", products); // Debug log

    productSelect.innerHTML = `<option value="">Select Product</option>`;

    products.forEach(p => {
      const option = document.createElement("option");
      option.value = p.product_id;
      option.textContent = `${p.product_name} (Stock: ${p.quantity})`;
      productSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading products:", err);
  }

//When a product is selected, auto-fill price
productSelect.addEventListener("change", () => {
  const selected = products.find(p => p.product_id === productSelect.value);
    if (selected) {
      unitPriceInput.value = selected.price;
      quantityInput.max = selected.quantity; // prevent overselling
      } else {
        unitPriceInput.value = "";
        totalAmountInput.value = "";
      }
    }); 
}

//Auto-calculate total
quantityInput.addEventListener("input", () => {
  const price = parseFloat(unitPriceInput.value);
  const qty = parseInt(quantityInput.value);
  totalAmountInput.value = !isNaN(price * qty) ? (price * qty).toFixed(2) : "";
});

async function saveSale() {
  const productSelect = document.getElementById("productSelect");
  const quantityInput = document.getElementById("quantity");
  const recordedByInput = document.getElementById("recordedBy");

  const productId = productSelect.value;
  const quantity = quantityInput.value;
  const recordedBy = recordedByInput.value.trim(); 
  const userId = localStorage.getItem("user_id"); // ✅ get logged-in user ID

  if (!productId || !quantity) {
    alert("Please select a product and enter quantity.");
    return;
  }

  const selectedProduct = products.find(p => p.product_id == productId);
  const totalAmount = selectedProduct ? selectedProduct.price * quantity : 0;

  const saleData = {
    productId,
    quantity,
    totalAmount,
    recordedBy,
    userId // ✅ include user id in request
  };

  try {
    const res = await fetch("../php/sales.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saleData)
    });

    const result = await res.json();
    console.log("Sale response:", result);

    if (result.success) {
      alert("Sale recorded successfully!");
      loadProducts();
      document.getElementById("saleForm").reset();
      document.getElementById("saleModal").style.display = "none";
    } else {
      alert(result.error || "Failed to record sale.");
    }
  } catch (err) {
    console.error("Error saving sale:", err);
  }

  closeModal();
  fetchSales();
}


// References to filter inputs
const dateFromFilter = document.getElementById("dateFromFilter");
const dateToFilter = document.getElementById("dateToFilter");
const productFilter = document.getElementById("productFilter");

// Load products into filter dropdown (reuse loadProducts data)
async function loadFilterProducts() {
  try {
    const res = await fetch("../php/get_products.php");
    const products = await res.json();

    // Populate dropdown
    productFilter.innerHTML = `<option value="">All Products</option>`;
    products.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.product_id;
      option.textContent = p.product_name;
      productFilter.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading products for filter:", err);
  }
}

// Apply filters whenever any input changes
[dateFromFilter, dateToFilter, productFilter].forEach((input) => {
  input.addEventListener("change", applyFilters);
});

// Filter logic
async function applyFilters() {
  console.log("Applying filters...");
  const fromDate = dateFromFilter.value;
  const toDate = dateToFilter.value;
  const productId = productFilter.value;

  // Build query parameters dynamically
  const params = new URLSearchParams();
  if (fromDate) params.append("from", fromDate);
  if (toDate) params.append("to", toDate);
  if (productId) params.append("product_id", productId);

  try {
    const res = await fetch(`../php/sales.php?${params.toString()}`);
    const data = await res.json();
    renderTable(data); // reuse your existing table renderer
  } catch (err) {
    console.error("Error applying filters:", err);
  }
}

// Edit Sale
async function editProduct(id) {
  try {
    const res = await fetch(`../php/sales.php?id=${id}`);
    const data = await res.json();
    const sale = Array.isArray(data) ? data[0] : data; // handle both array or single object

    if (!sale) {
      alert("Sale not found.");
      return;
    }

    // Get modal and title elements
    const modal = document.getElementById("saleModal");
    const modalTitle = document.getElementById("modalTitle");

    // Open modal
    modal.style.display = "flex";
    modalTitle.textContent = "Edit Sale";

    // Populate form fields
    document.getElementById("productSelect").value = sale.product_id;
    document.getElementById("quantity").value = sale.quantity_sold;
    document.getElementById("unitPrice").value = sale.price;
    document.getElementById("totalAmount").value = sale.total_amount;
    document.getElementById("recordedBy").value = sale.recorded_by;
    document.getElementById("saleDate").value = sale.sales_date;

  } catch (err) {
    console.error("Error loading sale details:", err);
    alert("Failed to load sale details. Check your console for errors.");
  }
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

// Initialize product filters on page load
document.addEventListener("DOMContentLoaded", loadFilterProducts);


//Initialize fetch
fetchSales();
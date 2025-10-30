
const modal = document.getElementById("newProductModal");
const modalTitle = document.getElementById("modalTitle");
const form = document.getElementById("newProductForm");
const tbody = document.getElementById("productsTableBody");
const categoryFilter = document.getElementById("categoryFilter");


//Filter products by category
function filterProducts() {
  const categoryId = document.getElementById("categoryFilter").value;

  // Fetch all products if no filter selected
  const url = categoryId
    ? `../php/get_products.php?category_id=${categoryId}`
    : `../php/get_products.php`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const tableBody = document.getElementById("productsTableBody");
      tableBody.innerHTML = "";

      if (data.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='8'>No products found</td></tr>";
        return;
      }

      data.forEach(prod => {
        const row = `
          <tr>
            <td>${prod.product_name}</td>
            <td>${prod.category_name}</td>
            <td>${prod.quantity}</td>
             <td>${prod.reorder_level}</td>
            <td>${prod.price}</td>
             <td>${prod.supplier ?? "-"}</td>
            <td>${prod.date_added}</td>
            <td>${prod.last_updated}</td>
            <td>
              <button class="action-btn" onclick="editProduct(${prod.product_id})">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn danger" onclick="deleteProduct(${prod.product_id})">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
      });
    })
    .catch(err => console.error("Error filtering products:", err));
}



//Fetch all products
async function fetchInventory() {
  const res = await fetch("../php/get_products.php");
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
      <td>${item.category_name}</td>
      <td>${item.quantity}</td>
      <td>${item.reorder_level}</td>
      <td>${item.price}</td>
      <td>${item.supplier ?? "-"}</td>
      <td>${item.date_added}</td>
      <td>${item.last_updated}</td>
      <td>
        <button class="action-btn" onclick="editProduct(${item.product_id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn danger" onclick="deleteProduct(${item.product_id})">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

//Open modal
function openModal() {
  modal.style.display = "flex";
  modalTitle.textContent = "Add New Product";
  form.reset();
  document.getElementById("product_id").value = "";
}

//Close modal
function closeModal() {
  modal.style.display = "none";
}

//save product (add or update)
async function saveProduct() {
  const product_id = document.getElementById("product_id").value;
  const product_name = document.getElementById("product_name").value;
  const category_id = document.getElementById("productCategory").value;
  const quantity = document.getElementById("quantity").value;
  const reorder_level = document.getElementById("reorder_level").value;
  const price = document.getElementById("price").value;
  const supplier = document.getElementById("supplier").value;

  // Determine URL — add or update
  const url = product_id
    ? "../php/update_product.php"
    : "../php/add_product.php";

  const payload = { 
    product_id,   
    product_name,
    category_id,
    quantity,
    reorder_level,
    price,
    supplier
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(data.message);

    closeModal('newProductModal');
    fetchInventory();
  } catch (err) {
    console.error("Error saving product:", err);
    alert("An error occurred while saving the product.");
  }
}



//Edit
async function editProduct(id) {
  try {
    const res = await fetch(`../php/get_products.php?id=${id}`);
    const data = await res.json();
    const p = Array.isArray(data) ? data[0] : data; // handle both array or single object

    // Get modal and title elements
    const modal = document.getElementById("newProductModal");
    const modalTitle = document.getElementById("modalTitle");

    //Open modal
    modal.style.display = "flex";
    modalTitle.textContent = "Edit Product";

    // Populate form fields
    document.getElementById("product_id").value = p.product_id;
    document.getElementById("product_name").value = p.product_name;
    document.getElementById("productCategory").value = p.category_id; // corrected ID
    document.getElementById("quantity").value = p.quantity;
    document.getElementById("reorder_level").value = p.reorder_level;
    document.getElementById("price").value = p.price;
    document.getElementById("supplier").value = p.supplier;
  } catch (err) {
    console.error("Error loading product details:", err);
    alert("Failed to load product details. Check your console for errors.");
  }
}

//Delete product
async function deleteProduct(product_id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch("../php/delete_product.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id })
    });

    const data = await res.json();
    alert(data.message);
    fetchInventory(); // refresh table
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("Failed to delete product.");
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


// 🔹 Initial Load
fetchInventory();


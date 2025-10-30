document.addEventListener("DOMContentLoaded", () => {
    const addUserBtn = document.getElementById("addUserBtn");
    const userModal = document.getElementById("userModal");
    const closeBtn = document.querySelector(".close-btn");
    const addUserForm = document.getElementById("addUserForm");
    const usersTable = document.getElementById("userBody");
    const logsTable = document.getElementById("logsBody");
    const globalSearch = document.getElementById("globalSearch");
    const editUserForm = document.getElementById("editUserForm");

   
    // --- Unified Search for Users & Logs ---
let allUsers = [];
let allLogs = [];

globalSearch.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();

    // Filter users
    const filteredUsers = allUsers.filter(u =>
        u.full_name.toLowerCase().includes(value) ||
        u.email.toLowerCase().includes(value) ||
        u.role.toLowerCase().includes(value)
    );

    // Filter logs
    const filteredLogs = allLogs.filter(l =>
        l.full_name.toLowerCase().includes(value) ||
        l.email.toLowerCase().includes(value) ||
        l.role.toLowerCase().includes(value) ||
        l.activity.toLowerCase().includes(value)
    );

    renderUsers(filteredUsers);
    renderLogs(filteredLogs);
});


    // Fetch users from backend
async function loadUsers() {
    const res = await fetch("../php/get_users.php");
    const data = await res.json();
    if (data.status === "success") {
        allUsers = data.data; // store globally for searching
        renderUsers(allUsers);
    } else console.error(data.message);
}

    // Fetch activity logs
async function loadLogs() {
    const res = await fetch("../php/get_user_logs.php");
    const data = await res.json();
    if (data.status === "success") {
        allLogs = data.data; // store globally for searching
        renderLogs(allLogs);
    } else console.error(data.message);
}

    //Render users table
    function renderUsers(users) {
        usersTable.innerHTML = "";
        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.user_id}</td>
                    <td>${user.full_name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="delete-btn" data-id="${user.user_id}"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            usersTable.insertAdjacentHTML("beforeend", row);
        });
    }

    // Handle edit and delete button actions
usersTable.addEventListener("click", async (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const userId = target.dataset.id;

    // --- DELETE USER ---
    if (target.classList.contains("delete-btn")) {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                const res = await fetch("../php/delete_user.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: userId }),
                });

                const data = await res.json();
                alert(data.message);
                if (data.status === "success") loadUsers();
            } catch (err) {
                console.error("Error deleting user:", err);
                alert("Error deleting user.");
            }
        }
    }

    // --- EDIT USER ---
    if (target.classList.contains("edit-btn")) {
        const row = target.closest("tr");
        const userId = row.children[0].textContent;
        const full_name = row.children[1].textContent;
        const email = row.children[2].textContent;
        const role = row.children[3].textContent;

        // Show editable modal
        document.getElementById("editUserModal").style.display = "flex";
        document.getElementById("editUserId").value = userId;
        document.getElementById("editUserName").value = full_name;
        document.getElementById("editUserEmail").value = email;
        document.getElementById("editUserRole").value = role;
    }

    //Handle edit form submission

    editUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user_id = document.getElementById("editUserId").value;
    const full_name = document.getElementById("editUserName").value.trim();
    const email = document.getElementById("editUserEmail").value.trim();
    const role = document.getElementById("editUserRole").value;

    try {
        const res = await fetch("../php/edit_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, full_name, email, role }),
        });

        const data = await res.json();
        alert(data.message);

        if (data.status === "success") {
            document.getElementById("editUserModal").style.display = "none";
            loadUsers();
        }
    } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
    }
});
});


    //Render logs table
    function renderLogs(logs) {
        logsTable.innerHTML = "";
        logs.forEach(log => {
            const row = `
                <tr>
                    <td>${log.activity_id}</td>
                    <td>${log.full_name}</td>
                    <td>${log.email}</td>
                    <td>${log.role}</td>
                    <td>${log.activity}</td>
                    <td>${log.activity_date}</td>
                </tr>`;
            logsTable.insertAdjacentHTML("beforeend", row);
        });
    }

    addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get values from form
  const full_name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value;

  // Validate fields
  if (!full_name || !email || !role) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    // Send to backend
    const res = await fetch("../php/add_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, role }),
    });

    const data = await res.json();

    alert(data.message);

    if (data.status === "success") {
      userModal.style.display = "none";
      addUserForm.reset(); // Clear form
      loadUsers(); // Refresh user list
    }
  } catch (error) {
    console.error("Error adding user:", error);
    alert("An error occurred. Please try again.");
  }
});

    

    //Modal control
    addUserBtn.onclick = () => userModal.style.display = "flex";
    closeBtn.onclick = () => userModal.style.display = "none";
    window.onclick = e => { if (e.target === userModal) userModal.style.display = "none"; };

    // Modal control
addUserBtn.onclick = () => userModal.style.display = "flex";

// --- Close any modal when "×" clicked ---
document.querySelectorAll(".close-btn").forEach(btn => {
    btn.onclick = () => btn.closest(".modal").style.display = "none";
});

// Close modal when clicking outside
window.onclick = e => {
    if (e.target.classList.contains("modal")) {
        e.target.style.display = "none";
    }
};

    //Initial load
    loadUsers();
    loadLogs();
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

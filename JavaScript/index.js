
let currentRole = 'admin';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.classList.contains('login-body')) {
    initializeLoginPage();
  }
});

// Initialize Login Page
function initializeLoginPage() {
  const loginForm = document.getElementById('loginForm');
  const roleButtons = document.querySelectorAll('.role-btn');

  // Handle role selection
  roleButtons.forEach((button) => {
    button.addEventListener('click', function () {
      roleButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');
      currentRole = this.dataset.role;
    });
  });

  // Handle login submission
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    showLoading();

    // Send login request
fetch("../php/login.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password, role: currentRole }),
})
  .then(async (res) => {
    const text = await res.text(); // get raw text first
    console.log("Raw response from server:", text);

    try {
      return JSON.parse(text); // Try to parse JSON
    } catch {
      throw new Error("Server did not return valid JSON. See console output above.");
    }
  })
  .then((data) => {
    console.log("Parsed JSON:", data);

    // Hide loader (if you have one)
    hideLoading();

    // Handle success or failure
    if (data.status === "success") {
      const userData = {
        id: data.user.id,
        fullname: data.user.fullname,
        email: data.user.email,
        role: data.user.role,
        //permissions: getRolePermissions(data.user.role),
      };

      // Store login info in localStorage
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("rememberMe", remember);

      showNotification("Login successful! Redirecting...", "success");

      setTimeout(() => {
        window.location.href = "../html/dashboard.html";
      }, 1500);
    } else {
      // Show error message from backend
      showNotification(data.message || "Login failed.", "error");
    }
  })
  .catch((error) => {
    hideLoading();
    console.error("Error:", error);
    showNotification("Server error: " + error.message, "error");
  });
}


// Toggle Password Visibility
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const passwordIcon = document.getElementById('passwordIcon');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    passwordIcon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    passwordIcon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}

// Loading state
function showLoading() {
  const btn = document.querySelector('.login-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>Signing In...</span> <i class="fas fa-spinner fa-spin"></i>`;
  }
}

function hideLoading() {
  const btn = document.querySelector('.login-btn');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<span>Sign In</span> <i class="fas fa-arrow-right"></i>`;
  }
}

// Notification popup
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

 function contactAdmin() {
      alert("Please contact the admin for further assistance regarding your password.");
    }

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
document.head.appendChild(style);

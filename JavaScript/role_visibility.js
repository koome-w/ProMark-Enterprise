document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user");
  if (!userData) return;

  const user = JSON.parse(userData);
  const role = user.role;

  // Loop through all nav items
  document.querySelectorAll(".nav-item").forEach(item => {
    const linkText = item.textContent.trim().toLowerCase();

    // Manager restrictions
    if (role === "Manager" && linkText.includes("users")) {
      item.style.display = "none";
    }

    // Employee restrictions
    if (role === "Employee" && (linkText.includes("users") || linkText.includes("reports"))) {
      item.style.display = "none";
    }
  });
});

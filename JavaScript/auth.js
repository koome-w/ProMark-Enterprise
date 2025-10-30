document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user");

  if (!userData) {
    window.location.href = "../html/dashboard.html";
    return;
  }

  const user = JSON.parse(userData);
  const role = user.role;

  const currentPage = window.location.pathname.split("/").pop();

  if (role === "Manager" && currentPage === "../html/users.html") {
    alert("Access denied: Managers cannot view the Users page.");
    window.location.href = "../html/dashboard.html";
  }

  if (role === "Employee" && (currentPage === "../html/users.html" || currentPage === "../html/reports.html")) {
    alert("Access denied: Employees cannot view this page.");
    window.location.href = "../html/dashboard.html";
  }
});

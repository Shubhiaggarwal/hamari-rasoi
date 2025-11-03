const SERVER_URL = "http://localhost:5001";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("⚠️ Please login first!");
    window.location.href = "login.html";
    return;
  }

  // Display basic info immediately
  document.getElementById("name").textContent = user.name;
  document.getElementById("email").textContent = user.email;
  document.getElementById("role").textContent = user.role;

  try {
    // Fetch latest user data from backend
    const res = await fetch(`${SERVER_URL}/api/user/profile/${user.id}`);
    if (res.ok) {
      const updatedUser = await res.json();
      document.getElementById("name").textContent = updatedUser.name;
      document.getElementById("email").textContent = updatedUser.email;
      document.getElementById("role").textContent = updatedUser.role;
    }
  } catch (err) {
    console.error("❌ Failed to load profile:", err);
  }

  // Logout functionality
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
});

 //const SERVER_URL = "http://localhost:5001";
const AUTH_SERVER_URL = "https://hamari-rasoi-5.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showPopup("⚠️ Please fill all fields!", "error");
      return;
    }

    try {
      const res = await fetch(`${AUTH_SERVER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showPopup(data.message, "success");

        // Save user info to localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to HOME page
        setTimeout(() => window.location.href = "index.html", 1000);

      } else {
        showPopup(data.error, "error");
      }
    } catch (err) {
      console.error(err);
      showPopup("❌ Server error", "error");
    }

    loginForm.reset();
  });
});

function showPopup(message, type) {
  const popup = document.createElement("div");
  popup.textContent = message;
  popup.className = `popup ${type}`;
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.padding = "10px 20px";
  popup.style.backgroundColor = type === "success" ? "#4BB543" : "#FF3333";
  popup.style.color = "#fff";
  popup.style.borderRadius = "5px";
  popup.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  popup.style.zIndex = "1000";
  popup.style.fontFamily = "Poppins, sans-serif";
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 3000);
}

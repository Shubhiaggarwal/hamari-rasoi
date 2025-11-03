const SERVER_URL = "http://localhost:5001";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
      showPopup("⚠️ Please fill all fields!", "error");
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();

      if (res.ok) {
        showPopup(data.message, "success");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          if (role === "donor") window.location.href = "donorProfile.html";
          else window.location.href = "requesterProfile.html";
        }, 1000);
      } else {
        showPopup(data.error, "error");
      }
    } catch (err) {
      console.error(err);
      showPopup("❌ Server error", "error");
    }

    signupForm.reset();
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

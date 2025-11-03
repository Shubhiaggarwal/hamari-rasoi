const SERVER_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", () => {
  const donorForm = document.getElementById("donorForm");
  const donorNameInput = document.getElementById("donorName");
  const foodTypeInput = document.getElementById("foodType");
  const donorLocationInput = document.getElementById("donorLocation");

  donorForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const donorName = donorNameInput.value.trim();
    const foodType = foodTypeInput.value.trim();
    const donorLocation = donorLocationInput.value.trim();

    if (!donorName || !foodType || !donorLocation) {
      showPopup("⚠️ Please fill all fields!", "error");
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/add-donor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donorName, foodType, donorLocation })
      });
      const data = await res.json();
      if (res.ok) {
        showPopup(data.message, "success");
      } else {
        showPopup(data.error, "error");
      }
    } catch (err) {
      console.error(err);
      showPopup("❌ Server error", "error");
    }

    donorForm.reset();
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

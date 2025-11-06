// const SERVER_URL = "http://localhost:5000";
const SERVER_URL = "https://hamari-rasoi.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const requestForm = document.getElementById("receiverForm");

  requestForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const receiver = {
      receiverName: document.getElementById("receiverName").value.trim(),
      requiredFood: document.getElementById("requiredFood").value.trim(),
      receiverLocation: document.getElementById("receiverLocation").value.trim()
    };

    if (!receiver.receiverName || !receiver.requiredFood || !receiver.receiverLocation) {
      showPopup("⚠️ Please fill all fields!", "error");
      return;
    }

    try {
      const res = await fetch(`${SERVER_URL}/add-receiver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiver)
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

    requestForm.reset();
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

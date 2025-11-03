const donorSelect = document.getElementById('donorSelect');
const donorList = document.getElementById('donorList');
const receiverSelect = document.getElementById('receiverSelect');
const receiverList = document.getElementById('receiverList');

// Load donors from server
function loadDonors() {
  fetch('http://localhost:5000/donors')
    .then(res => res.json())
    .then(donors => {
      donorSelect.innerHTML = '<option value="">Select Donor</option>';
      donorList.innerHTML = '';
      donors.forEach((d, index) => {  // added index
        // Dropdown option
        const option = document.createElement('option');
        option.value = d.id;
        option.textContent = `${d.donorName} - ${d.foodType} - ${d.donorLocation}`;
        donorSelect.appendChild(option);

        // Donor list item
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${d.donorName} - ${d.foodType} - ${d.donorLocation}</span>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        `;
        li.querySelector('.delete-btn').onclick = () => deleteDonor(d.id);

        // Edit button functionality fixed
        li.querySelector('.edit-btn').onclick = () => editDonorObject(d);

        donorList.appendChild(li);
      });
    });
}

// Load receivers from server
function loadReceivers() {
  fetch('http://localhost:5000/receivers')
    .then(res => res.json())
    .then(receivers => {
      receiverSelect.innerHTML = '<option value="">Select Receiver</option>';
      receiverList.innerHTML = '';
      receivers.forEach((r, index) => {  // added index
        // Dropdown option
        const option = document.createElement('option');
        option.value = r.id;
        option.textContent = `${r.receiverName} - ${r.requiredFood} - ${r.receiverLocation}`;
        receiverSelect.appendChild(option);

        // Receiver list item
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${r.receiverName} - ${r.requiredFood} - ${r.receiverLocation}</span>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        `;
        li.querySelector('.delete-btn').onclick = () => deleteReceiver(r.id);

        // Edit button functionality fixed
        li.querySelector('.edit-btn').onclick = () => editReceiverObject(r);

        receiverList.appendChild(li);
      });
    });
}

// Delete donor via server
function deleteDonor(name) {
  fetch(`http://localhost:5000/delete-donor/${encodeURIComponent(name)}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => loadDonors());
}

// Delete receiver via server
function deleteReceiver(name) {
  fetch(`http://localhost:5000/delete-receiver/${encodeURIComponent(name)}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => loadReceivers());
}

let currentEditing = null; // store which donor/receiver is being edited
function editDonorObject(donor) {
  currentEditing = { type: "donor", id: donor.id };
  document.getElementById("editName").value = donor.donorName;
  document.getElementById("editFood").value = donor.foodType;
  document.getElementById("editLocation").value = donor.donorLocation;
  document.getElementById("editFormContainer").style.display = "block";
}

function editReceiverObject(receiver) {
  currentEditing = { type: "receiver", id: receiver.id };
  document.getElementById("editName").value = receiver.receiverName;
  document.getElementById("editFood").value = receiver.requiredFood;
  document.getElementById("editLocation").value = receiver.receiverLocation;
  document.getElementById("editFormContainer").style.display = "block";
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadDonors();
  loadReceivers();
});

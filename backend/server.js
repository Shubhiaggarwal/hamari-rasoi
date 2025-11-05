const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
//const PORT = 5000;
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend and assets
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

// JSON files
const donorsFile = path.join(__dirname, 'donors.json');
const receiversFile = path.join(__dirname, 'receivers.json');

// Helper functions
function readData(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return []; }
}

function writeData(file, data) {
  try { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }
  catch (err) { console.error(err); }
}

// ---------- DONORS ----------

// Add donor
app.post('/add-donor', (req, res) => {
  const { donorName, foodType, donorLocation } = req.body;
  if (!donorName || !foodType || !donorLocation)
    return res.status(400).json({ error: 'Please fill all fields' });

  const donors = readData(donorsFile);
  const id = Date.now(); // unique ID
  donors.push({ id, donorName, foodType, donorLocation });
  writeData(donorsFile, donors);
  res.json({ message: 'Donor added', donors });
});

// Delete donor by ID
app.delete('/delete-donor/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const donors = readData(donorsFile);
  const filtered = donors.filter(d => d.id !== id);
  if (filtered.length === donors.length)
    return res.status(400).json({ error: 'Donor not found' });

  writeData(donorsFile, filtered);
  res.json({ message: 'Donor deleted', donors: filtered });
});

// Get all donors
app.get('/donors', (req, res) => res.json(readData(donorsFile)));

// ---------- RECEIVERS ----------

// Add receiver
app.post('/add-receiver', (req, res) => {
  const { receiverName, requiredFood, receiverLocation } = req.body;
  if (!receiverName || !requiredFood || !receiverLocation)
    return res.status(400).json({ error: 'Please fill all fields' });

  const receivers = readData(receiversFile);
  const id = Date.now(); // unique ID
  receivers.push({ id, receiverName, requiredFood, receiverLocation });
  writeData(receiversFile, receivers);
  res.json({ message: 'Receiver added', receivers });
});

// Delete receiver by ID
app.delete('/delete-receiver/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const receivers = readData(receiversFile);
  const filtered = receivers.filter(r => r.id !== id);
  if (filtered.length === receivers.length)
    return res.status(400).json({ error: 'Receiver not found' });

  writeData(receiversFile, filtered);
  res.json({ message: 'Receiver deleted', receivers: filtered });
});

// Get all receivers
app.get('/receivers', (req, res) => res.json(readData(receiversFile)));

// ---------- UPDATE DATA (edit / coordinates) ----------
app.post("/update-coordinates", (req, res) => {
  const { type, id, lat, lng, name, food, location } = req.body;
  let dataFile = type === "donor" ? donorsFile : receiversFile;
  let data = readData(dataFile);

  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    if (lat !== undefined) data[index].lat = lat;
    if (lng !== undefined) data[index].lng = lng;

    if (name !== undefined) {
      type === "donor" ? data[index].donorName = name : data[index].receiverName = name;
    }
    if (food !== undefined) {
      type === "donor" ? data[index].foodType = food : data[index].requiredFood = food;
    }
    if (location !== undefined) {
      type === "donor" ? data[index].donorLocation = location : data[index].receiverLocation = location;
    }

    writeData(dataFile, data);
    res.json({ message: "Data updated" });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// ---------- START SERVER ----------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

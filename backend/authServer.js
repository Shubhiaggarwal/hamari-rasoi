const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersFile = path.join(__dirname, 'users.json');

function readData(file) {
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } 
  catch { return []; }
}

function writeData(file, data) {
  try { fs.writeFileSync(file, JSON.stringify(data, null, 2)); } 
  catch (err) { console.error(err); }
}

app.post('/signup', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ error: 'Please fill all fields' });

  const users = readData(usersFile);
  if (users.find(u => u.email === email))
    return res.status(400).json({ error: 'Email already exists' });

  const id = Date.now();
  users.push({ id, name, email, password, role });
  writeData(usersFile, users);
  res.json({ message: 'Signup successful', user: { id, name, email, role } });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Please fill all fields' });

  const users = readData(usersFile);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/user/profile/:id', (req, res) => {
  const users = readData(usersFile);
  const user = users.find(u => u.id == req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.put('/api/user/update/:id', (req, res) => {
  const users = readData(usersFile);
  const userIndex = users.findIndex(u => u.id == req.params.id);
  if (userIndex === -1)
    return res.status(404).json({ error: 'User not found' });

  const updatedUser = { ...users[userIndex], ...req.body };
  users[userIndex] = updatedUser;
  writeData(usersFile, users);

  res.json({ message: 'Profile updated successfully', user: updatedUser });
});

app.listen(PORT, () => console.log(`✅ Auth server running at http://localhost:${PORT}`));

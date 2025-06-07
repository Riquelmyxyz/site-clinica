const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const USERS_FILE = './users.json';

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/api/register', async (req, res) => {
  const { name, cpf, password, type } = req.body;
  const users = loadUsers();

if (users.find(u => u.cpf === cpf && u.type === type)) {
  return res.status(400).json({ error: 'Usuário já cadastrado.' });
}

  const hashed = await bcrypt.hash(password, 10);
  const user = { name, cpf, password: hashed, type };
  users.push(user);
  saveUsers(users);
  res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

app.post('/api/login', async (req, res) => {
  const { cpf, password, type } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.cpf === cpf && u.type === type);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Senha incorreta.' });

  res.json({ name: user.name });
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});

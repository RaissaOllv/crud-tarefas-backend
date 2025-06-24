const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: 'https://crud-tarefas.vercel.app' }));
app.use(express.json());

const DB_PATH = './db.json';

function getTarefas() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

app.get('/tarefas', (req, res) => {
  res.json(getTarefas());
});

app.post('/tarefas', (req, res) => {
  const tarefas = getTarefas();
  const nova = { id: Date.now(), ...req.body };
  tarefas.push(nova);
  fs.writeFileSync(DB_PATH, JSON.stringify(tarefas, null, 2));
  res.status(201).json(nova);
});

app.put('/tarefas/:id', (req, res) => {
  let tarefas = getTarefas();
  tarefas = tarefas.map(t => t.id == req.params.id ? { ...t, ...req.body } : t);
  fs.writeFileSync(DB_PATH, JSON.stringify(tarefas, null, 2));
  res.json({ message: 'Atualizado' });
});

app.delete('/tarefas/:id', (req, res) => {
  let tarefas = getTarefas();
  tarefas = tarefas.filter(t => t.id != req.params.id);
  fs.writeFileSync(DB_PATH, JSON.stringify(tarefas, null, 2));
  res.json({ message: 'Deletado' });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

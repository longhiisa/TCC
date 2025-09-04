const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'escola',
  port: 3307
});

connection.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar com MySQL:', err);
    return;
  }
  console.log('✅ Conectado ao MySQL!');
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('API funcionando!'));

app.listen(port, () => console.log(`Servidor rodando em ${port}`));

const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Permite que qualquer front-end acesse (ou especifique: 'http://localhost:5500')
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do banco de dados
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'escola',
    port : 3307
};

// Função para conectar ao banco
async function connectDB() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conectado ao banco de dados MySQL');
        return connection;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
        throw error;
    }
}

// Rota padrão
app.get('/', (req, res) => {
    res.json({ message: 'API de cadastro de admin funcionando!' });
});

// Rota para cadastro de admin
app.post('/api/admin/register', async (req, res) => {
    const { nome_completo, email, senha, confirmar_senha } = req.body;

    try {
        if (!nome_completo || !email || !senha || !confirmar_senha) {
            return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
        }

        if (senha !== confirmar_senha) {
            return res.status(400).json({ success: false, message: 'As senhas não conferem' });
        }

        if (senha.length < 6) {
            return res.status(400).json({ success: false, message: 'A senha deve ter pelo menos 6 caracteres' });
        }

        const connection = await connectDB();

        const [existingAdmin] = await connection.execute(
            'SELECT id FROM admins WHERE email = ?',
            [email]
        );

        if (existingAdmin.length > 0) {
            await connection.end();
            return res.status(400).json({ success: false, message: 'Este email já está cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const [result] = await connection.execute(
            'INSERT INTO admins (nome_completo, email, senha) VALUES (?, ?, ?)',
            [nome_completo, email, hashedPassword]
        );

        await connection.end();

        res.status(201).json({ success: true, message: 'Admin cadastrado com sucesso!', adminId: result.insertId });

    } catch (error) {
        console.error('Erro ao cadastrar admin:', error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

// Rota para login de admin
app.post('/api/admin/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
  }

  try {
    const connection = await connectDB();

    const [rows] = await connection.execute(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );

    await connection.end();

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    const admin = rows[0];

    const senhaCorreta = await bcrypt.compare(senha, admin.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ success: false, message: 'Email ou senha inválidos' });
    }

    res.json({ success: true, message: 'Login realizado com sucesso!', adminId: admin.id });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
});


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 API acessível em: http://localhost:${PORT}`);
});

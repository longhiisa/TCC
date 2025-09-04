const db = require('../db');

exports.cadastrarAluno = async (req, res) => {
  const {
    nomeCompleto,
    matricula,
    turma,
    telefoneResponsavel,
    dataNascimento,
    responsavel,
    rfid
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO alunos 
      (nomeCompleto, matricula, turma, telefoneResponsavel, dataNascimento, responsavel, rfid) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nomeCompleto, matricula, turma, telefoneResponsavel, dataNascimento, responsavel, rfid]
    );

    res.status(201).json({ message: 'Aluno cadastrado com sucesso!', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
};

const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;


app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'atividadesigno',
    password: 'ds564',
    port: 7007,
});

function calcularIdade(dataNascimento) {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mes_atual = hoje.getMonth();
  const mes_nascimento = dataNascimento.getMonth();
  if (mes_nascimento > mes_atual || (mes_nascimento === mes_atual && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
  }
  return idade;
}

function calcularSigno(mes, dia) {
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
      return 'Aquário';
  } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
      return 'Peixes';
  } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
      return 'Áries';
  } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
      return 'Touro';
  } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
      return 'Gêmeos';
  } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
      return 'Câncer';
  } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
      return 'Leão';
  } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
      return 'Virgem';
  } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
      return 'Libra';
  } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
      return 'Escorpião';
  } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
      return 'Sagitário';
  } else {
      return 'Capricórnio';
  }
}

app.post('/usuarios', async (req, res) => {
  try {
      const { nome, email, data_nascimento } = req.body;

      const dataNascimento = new Date(data_nascimento);
      const idade = calcularIdade(dataNascimento);
      const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());

      await pool.query('INSERT INTO usuarios (nome, idade, email, data_nascimento, signo) VALUES ($1, $2, $3, $4, $5)', [nome, idade, email, data_nascimento, signo]);
      res.status(201).send({ mensagem: 'Usuário adicionado com sucesso' });

  } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      res.status(500).send('Erro ao adicionar usuário');
  }
});

app.get('/usuarios', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM usuarios');
      res.json({
          total: result.rowCount,
          usuarios: result.rows,
      });
  } catch (error) {
      console.error('Erro ao obter usuários:', error);
      res.status(500).send('Erro ao obter usuários');
  }
});

app.put('/usuarios/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { nome, email, data_nascimento } = req.body;
      const dataNascimento = new Date(data_nascimento);
      const idade = calcularIdade(dataNascimento);
      const signo = calcularSigno(dataNascimento.getMonth() + 1, dataNascimento.getDate());
      await pool.query('UPDATE usuarios SET nome = $1, idade = $2, email = $3, data_nascimento = $4, signo = $5 WHERE id = $6', [nome, idade, email, data_nascimento, signo, id]);
      res.status(200).send({ mensagem: 'Usuário atualizado com sucesso' });
  } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).send('Erro ao atualizar usuário');
  }
});

app.delete('/usuarios/:id', async (req, res) => {
  try {
      const { id } = req.params;
      await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
      res.status(200).send({ mensagem: 'Usuário excluído com sucesso' });
  } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).send('Erro ao excluir usuário');
  }
});

app.get('/', async (req, res) => {
  res.status(200).send({ mensagem: 'Servidor rodando com sucesso!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
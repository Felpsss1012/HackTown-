// 1. IMPORTAÇÕES DAS BIBLIOTECAS
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 2. CONFIGURAÇÃO DO SERVIDOR
const app = express();
const port = 3001;

// Middlewares: preparam o servidor para entender JSON e permitir acesso externo (CORS)
app.use(cors());
app.use(express.json());

// 3. CONEXÃO COM O BANCO DE DADOS MYSQL
// ATENÇÃO: Substitua com suas credenciais!
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Root_1012',
    database: 'hubly',
    multipleStatements: true
});

// Verifica a conexão com o banco de dados
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados MySQL com sucesso! ID:', connection.threadId);
});


// 4. ROTAS DA API (ENDPOINTS)

// ========== ROTA DE CADASTRO DE USUÁRIO ==========
app.post('/api/register', (req, res) => {
  const { fullName, email, password, accountType } = req.body;

  // IMPORTANTE: Em produção, você DEVE criptografar a senha antes de salvar!
  // Ex: const hashedPassword = await bcrypt.hash(password, 10);
  
  const sql = 'INSERT INTO usuarios (nome, email, senha, tipo_conta) VALUES (?, ?, ?, ?)';
  connection.query(sql, [fullName, email, password, accountType], (err, results) => {
    if (err) {
      console.error("Erro no cadastro:", err);
      return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  });
});

// ========== ROTA PARA DADOS DO DASHBOARD ==========
app.get('/root/hubly', (req, res) => {
  const kpiQueries = {
    faturamento: 'SELECT SUM(valor_bruto) as faturamentoMes FROM vendas WHERE MONTH(data_venda) = MONTH(CURDATE())',
    pedidos: 'SELECT COUNT(id) as pedidosMes FROM vendas WHERE MONTH(data_venda) = MONTH(CURDATE())',
    estoqueBaixo: 'SELECT COUNT(id) as produtosEstoqueBaixo FROM produtos WHERE estoque < 10'
  };

  // Executa as queries em paralelo para mais eficiência
  connection.query(`${kpiQueries.faturamento}; ${kpiQueries.pedidos}; ${kpiQueries.estoqueBaixo}`, (err, results) => {
    if (err) {
      console.error("Erro ao buscar dados para o dashboard:", err);
      return res.status(500).json({ message: 'Erro ao buscar dados do dashboard.' });
    }
    
    const data = {
      faturamentoMes: results[0][0].faturamentoMes || 0,
      pedidosMes: results[1][0].pedidosMes || 0,
      estoqueBaixo: results[2][0].produtosEstoqueBaixo || 0,
    };

    res.json(data);
  });
});

// ========== ROTAS DE GERENCIAMENTO DE PRODUTOS (CRUD) ==========

// Listar todos os produtos (Read)
app.get('/api/products', (req, res) => {
  const sql = 'SELECT id, nome, preco, custo, estoque FROM produtos';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao listar produtos:", err);
      return res.status(500).json({ message: 'Erro ao buscar produtos.' });
    }
    res.json(results);
  });
});

// Adicionar um novo produto (Create)
app.post('/api/products', (req, res) => {
  const { nome, descricao, preco, custo, estoque } = req.body;
  const sql = 'INSERT INTO produtos (nome, descricao, preco, custo, estoque) VALUES (?, ?, ?, ?, ?)';
  connection.query(sql, [nome, descricao, preco, custo, estoque], (err, results) => {
    if (err) {
      console.error("Erro ao adicionar produto:", err);
      return res.status(500).json({ message: 'Erro ao adicionar produto.' });
    }
    res.status(201).json({ message: 'Produto adicionado com sucesso!', id: results.insertId });
  });
});

// Atualizar um produto existente (Update)
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, custo, estoque } = req.body;
  const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, custo = ?, estoque = ? WHERE id = ?';
  connection.query(sql, [nome, descricao, preco, custo, estoque, id], (err, results) => {
    if (err) {
      console.error("Erro ao atualizar produto:", err);
      return res.status(500).json({ message: 'Erro ao atualizar produto.' });
    }
    res.json({ message: 'Produto atualizado com sucesso!' });
  });
});

// Deletar um produto (Delete)
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM produtos WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      // Se houver vendas ligadas a este produto, o DB pode bloquear a exclusão.
      console.error("Erro ao deletar produto:", err);
      return res.status(500).json({ message: 'Erro ao deletar produto. Verifique se existem vendas associadas.' });
    }
    res.json({ message: 'Produto deletado com sucesso!' });
  });
});


// 5. INICIALIZAÇÃO DO SERVIDOR
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`); 
});
-- =========== Tabela de Usuários ===========
-- Armazena os dados de login e o tipo de conta (gestor ou comum).

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_conta ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========== Tabela de Produtos ===========
-- Armazena o catálogo de produtos, preços e controle de estoque.

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0
);


-- =========== Tabela de Vendas ===========
-- Registra cada transação, ligando um produto a uma venda.
-- Esta tabela deve ser criada depois da 'produtos' por causa da chave estrangeira.


CREATE TABLE IF NOT EXISTS vendas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT,
    quantidade INT NOT NULL,
    valor_bruto DECIMAL(10, 2) NOT NULL,      -- RENOMEADO (valor total da venda)
    valor_liquido DECIMAL(10, 2) NOT NULL,    -- NOVO (valor após taxas/descontos)
    lucro_percentual DECIMAL(5, 2),           -- NOVO (margem de lucro da venda)
    data_venda TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
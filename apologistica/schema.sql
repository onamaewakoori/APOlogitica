CREATE DATABASE IF NOT EXISTS apologistica CHARACTER SET utf8mb4;
USE apologistica;

CREATE TABLE IF NOT EXISTS produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  sku VARCHAR(60),
  descricao TEXT,
  peso DECIMAL(10,3) DEFAULT 0,
  valor DECIMAL(12,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS enderecos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apelido VARCHAR(100) NOT NULL,
  cep VARCHAR(10),
  numero VARCHAR(20),
  complemento VARCHAR(100),
  bairro VARCHAR(100),
  cidade VARCHAR(100) NOT NULL,
  uf CHAR(2) NOT NULL
);

CREATE TABLE IF NOT EXISTS transportadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  tipo_doc VARCHAR(4) NOT NULL,
  documento VARCHAR(20),
  placa VARCHAR(10),
  email VARCHAR(120),
  telefones VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS fretes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  data_frete DATE NOT NULL,
  origem_id INT NOT NULL,
  destino_id INT NOT NULL,
  transportador_id INT NOT NULL,
  FOREIGN KEY (origem_id) REFERENCES enderecos(id),
  FOREIGN KEY (destino_id) REFERENCES enderecos(id),
  FOREIGN KEY (transportador_id) REFERENCES transportadores(id)
);

CREATE TABLE IF NOT EXISTS frete_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  frete_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  FOREIGN KEY (frete_id) REFERENCES fretes(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);
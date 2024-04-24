CREATE DATABASE atividadesigno;

\c atividadesigno;


CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    idade INTEGER NOT NULL,
    email VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    signo VARCHAR(100) NOT NULL
);

INSERT INTO usuarios (nome, idade, email, data_nascimento, signo) VALUES ('manuela', 16, 'manuelamachado@aluno.senai.br', '2007-05-14', 'touro' );
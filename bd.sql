CREATE DATABASE pedro_bd;
USE pedro_bd;

CREATE TABLE usuarios (
id int primary key auto_increment,
nome varchar(128) not null,
email varchar(30) not null,
senha varchar(128) not null
);

CREATE TABLE tipo_refeicao (
id int primary key not null auto_increment,
nome char (20)
);

INSERT INTO tipo_refeicao (nome) VALUES ("Café da manhã"), ("Almoço"), ("Café da tarde"), ("Jantar"), ("Lanche"), ("Outros");

CREATE TABLE refeicoes (

id_refeição int primary key not null auto_increment,
id_usuario int not null,
tipo_refeicao char(32) not null,
fastfood tinyint not null,
motivacao char(32) not null,
hora_refeicao time not null,
data_refeicao date not null,
foto char(128),

constraint foreign key (id_usuario) references usuarios (id) 
);
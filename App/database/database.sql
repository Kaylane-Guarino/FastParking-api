create database fastparking;

use fastparking;

create table tblRegistro(
    id int primary key auto_increment,
    nome varchar(255) not null,
    placa varchar(8) not null,
    dataEntrada date not null,
    horaEntrada time not null,
    dataSaida date not null,
    horaSaida time not null,
    ativo boolean not null,
    valorTotal decimal (10,2));
    
create table tblPreco(
    id int primary key auto_increment,
    valorPrimeiraHora decimal(10,2) not null,
    valorDemaisHoras decimal(10,2));

select * from tblPreco;
select * from tblRegistro;
show tables;

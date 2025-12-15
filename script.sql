select * from tbl_empresa;

CREATE TABLE tbl_filme_empresa(
id_filme_empresa int primary key not null auto_increment,
id_filme int not null,
id_empresa int not null,
foreign key(id_filme)references tbl_filme(id_filme),
foreign key(id_empresa) references tbl_empresa(id_empresa)
);

select * from tbl_empresa;

CREATE TABLE tbl_filme_autor(
id_filme_autor int primary key not null auto_increment,
nome_filme varchar(100) not null,
id_filme int not null,
id_ator int not null,
foreign key(id_filme) references tbl_filme(id_filme),
foreign key(id_ator) references tbl_ator(id_ator)
);

create table tbl_filme_classificacao(
id_filme_classificacao int primary key not null auto_increment,
id_filme int not null,
id_classificacao int not null,
descricao varchar(600) null,
foreign key(id_filme) references tbl_filme(id_filme),
foreign key(id_classificacao) references tbl_classificacao(id_classificacao)
);

select * from tbl_ator;
select * from tbl_classificacao;

select * from tbl_filme_classificacao;

select * from tbl_filme;

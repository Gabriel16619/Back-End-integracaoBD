/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL referente ao relaciolamento entre filme e genero
 * Data: 05/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.1
 * document: Genero.js (todas as funcoes voltadas aos generos de filmes vão se encontrar nese documento)
 ****************************************************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

// Pegar os generos de todos os filmes e generos do banco de dados
const getSelectAllFilmesGenre = async function (params) {
    try{
        let sql = `select * from tbl_filme_genero order by desc`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)){
            return result
        }else{
            return false
        }
    } catch (error){
        console.log(error)
        return false
    }
    
}

// Mostar genero do filme pelo ID
const getSelectBYIdFilmGenre = async function (id) {
    try{
        let sql = `select * from tbl_filme_genero where id_filme_genero=${id}`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
        return false
    }
    }

//retorna o id mais alto da tabela tbl_filme, ou seja, o último filme cadastrado (caso o id seja autoincremento).
const getSelectLastId = async function () {
    try {
     
   
      const sql = `SELECT id_filme_genero FROM tbl_filme_genero ORDER BY id_filme_genero desc limit 1`;
  
      // Executa no BD o script SQL
      const result = await prisma.$queryRawUnsafe(sql);
      console.log(result);
  
      // Validação para identificar se o retorno do banco é um array, vazio ou com dados
      if (Array.isArray(result) && result.length > 0) {
        return Number(result[0].id_filme_genero);
      } else {
        return false;
      }
  
    } catch (error) {
      console.error("Erro ao buscar último ID do gênero:", error);
      return false;
    }
}
  
//insirir novo genero
const getInsertGenero = async function (genero) {
    try {
      // Corrigindo o SQL (faltavam vírgulas, aspas e parênteses errados)
      let sql = `
        INSERT INTO tbl_filme_genero (
          id, 
          id_genero
        ) VALUES (
          '${genero.id}',
          '${genero.id_genero}'
        )
      `;
      
  
      // Executa o comando de inserção no banco
      let result = await prisma.$executeRawUnsafe(sql);
  
      // Verifica se deu certo
      if (result) {
        return true;
      } else {
        return false;
      }
  
    } catch (error) {
      console.error("Erro ao inserir gênero:", error);
      return false;
    }
  }

  // retorna os generos filtrando pelo id do filme do banco de
const getSelectGenresBYIdFilm = async function (idFilme) {
    try{
        let sql =   `select tbl_genero.id_genero, tbl_genero.nome
                     from tbl_filme
                            inner join tbl_filme_genero
                            on tbl_filme.id = tbl_filme_genero.id
                        inner join tbl_genero
                            on tbl_genero.id_genero = tbl_filme_genero.id_genero
                     where tbl_filme.id=${idFilme}`
        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)) {
            return result
        } else {
            return false
        }

    } catch (error) {
        console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
        return false
    }
    }

    // retorna os filmes filtrando pelo id do genero no bd
const getSelectBYIdGenre = async function (idGenero) {
        try{
            let sql =   `select tbl_filme.id, tbl_filme.nome
                         from tbl_filme
                                inner join tbl_filme_genero
                                on tbl_filme.id = tbl_filme_genero.id
                            inner join tbl_genero
                                on tbl_genero.id = tbl_filme_genero.id_genero
                         where tbl_genero.id_genero=${idGenero}`
            let result = await prisma.$queryRawUnsafe(sql)
    
            if (Array.isArray(result)) {
                return result
            } else {
                return false
            }
    
        } catch (error) {
            console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
            return false
        }
    }

const setInsertFilmGenre = async function (filmeGenero) {
        try {
            let sql = `insert into tbl_filme_genero (id, id_genero)
            values(${filmeGenero.id}, ${filmeGenero.id_genero})`
           
    
            //$executeRawUnsafe()  -> permite apenas executar scripts sql que não tem retorno de dados (INSERT, UPDATE, DELETE)
            let result = await prisma.$executeRawUnsafe(sql)
    
            if (result) {
           
                return true
            } else {
                return false
            }
        } catch (error) {
       
            return false
        }
    }

const setUpdateFilmsGenre = async function (filmeGenero) {

    try {
        let sql = `update tbl_filme_genero set
        id_filme  = '${filmeGenero.id}',
        id_genero = '${filmeGenero.id_genero}'
        where id  =  ${filmeGenero.id}`


        //$executeRawUnsafe()  -> permite apenas executar scripts sql que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {

        return false
    }

}

const setDeleteFilmsGenre = async function (id) {

    try {
        let sql = `DELETE FROM tbl_filme_genero where id_genero = ${id}`

        //$executeRawUnsafe()  -> permite apenas executar scripts sql que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
  
module.exports = {
    getSelectAllFilmesGenre,
    getSelectBYIdFilmGenre,
    getSelectBYIdGenre,
    getSelectLastId,
    getInsertGenero,
    getSelectGenresBYIdFilm,
    setInsertFilmGenre,
    setUpdateFilmsGenre,
    setDeleteFilmsGenre
}


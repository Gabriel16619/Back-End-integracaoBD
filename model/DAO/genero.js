/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL
 * Data: 01/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.1
 * document: Genero.js (todas as funcoes voltadas aos generos de filmes vão se encontrar nese documento)
 ****************************************************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

// Pegar os generos de todos os filmes.
const getSelectBYGenero = async function (params) {
    try{
        let sql = `select * from tbl_genero`

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
const getSelectBYIdGenero = async function (id) {
    try{
        let sql = `select * from tbl_genero where id_genero=${id}`
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
const getSelectLastIdGenero = async function () {
    try {
     
      const sql = `SELECT id_genero FROM tbl_genero ORDER BY id_genero desc limit 1`;
  
      // Executa no BD o script SQL
      const result = await prisma.$queryRawUnsafe(sql);
      console.log(result);
  
      // Validação para identificar se o retorno do banco é um array, vazio ou com dados
      if (Array.isArray(result) && result.length > 0) {
        return Number(result[0].id_genero);
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
        INSERT INTO tbl_genero (
          nome, 
          descricao
        ) VALUES (
          '${genero.nome}'
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
  };
  
    
module.exports = {
    getSelectBYGenero,
    getSelectBYIdGenero,
    getSelectLastIdGenero,
    getInsertGenero
}
/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 * document: empresa.js (responsavel pelo script das empresas que criaram os filmes ex: Marvel, DC etc)
 ****************************************************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

// lista todas as empresas
const getSelectBYAutor= async function (params) {
    try{
        let sql = `select * from tbl_autor`

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
// mostra a empresa pelo id
const getSelectBYIdAutor = async function (id) {
    try{
        let sql = `select * from tbl_autor where id_autor=${id}`
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
 // adiciona uma nova empresa
const getInsertAutor = async function (autor) {
    try {
      // Corrigindo o SQL (faltavam vírgulas, aspas e parênteses errados)
      let sql = `
        INSERT INTO tbl_autor (
          nome, 
          biografia,
         local_nascimento
        ) VALUES (
          '${autor.nome}',
          '${autor.biografia}',
          '${autor.local_nascimento}'
        )
      `;

      // Executa o comando de inserção no banco
      let result = await prisma.$executeRawUnsafe(sql);
      console.log(result, "erro de sql")
  
      // Verifica se deu certo
      if (result) {
        return true;
      } else {
        return false;
      }
  
    } catch (error) {
      console.error("Erro ao inserir empresa:", error);
      return false;
    }
  }

const deleteByIdAutor = async function (id) {
    try {
        let sql = `DELETE FROM tbl_autor where id_autor = ${id}`

        //$executeRawUnsafe()  -> permite apenas executar scripts sql que não tem retorno de dados (INSERT, UPDATE, DELETE)
        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}
 
// puxa pelo ultimo id inserido
const getSelectLastIdAutor = async function () {

    try {
        //Script SQL 
        let sql = `select id_autor from tbl_autor order by id_autor desc limit 1`

       
        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result)

        /*  if (result.length > 0 ) */
        //validação para identificar se o retorno do banco e um array, vazio ou com dados

        if (Array.isArray(result)) {
            return Number(result[0].id_autor)
        } else {
            return false
        }

    } catch (error) {
        console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
        return false
    }
    
}

module.exports = {
    getSelectBYAutor,
    getSelectBYIdAutor,
    getInsertAutor,
    getSelectLastIdAutor,
    deleteByIdAutor
}
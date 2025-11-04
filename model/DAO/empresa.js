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
const getSelectBYEmpresa= async function (params) {
    try{
        let sql = `select * from tbl_empresa`

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
const getSelectBYIdEmpresa = async function (id) {
    try{
        let sql = `select * from tbl_empresa where id_empresa=${id}`
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
const getInsertEmpresa = async function (empresa) {
    try {
        
      // Corrigindo o SQL (faltavam vírgulas, aspas e parênteses errados)
      let sql = `
        INSERT INTO tbl_empresa (
          nome, 
          localidade,
          descricao,
          data_fundacao,
          data_fechamento,
          fundador_empresa
        ) VALUES (
          '${empresa.nome}',
          '${empresa.localidade}',
          '${genero.descricao}'
          '${empresa.data_fundacao}',
          '${empresa.data_fechamento}',
          '${empresa.fundador_empresa}'
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
      console.error("Erro ao inserir empresa:", error);
      return false;
    }
  }

const deleteByIdEmpresa = async function (id) {
    try {
        let sql = `DELETE FROM tbl_empresa where id_empresa = ${id}`

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
const getSelectLastIdEmpresa = async function (params) {

    try {
        //Script SQL 
        let sql = `select id from tbl_empresa order by id desc limit 1`

       
        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result)

        /*  if (result.length > 0 ) */
        //validação para identificar se o retorno do banco e um array, vazio ou com dados

        if (Array.isArray(result)) {
            return Number(result[0].id)
        } else {
            return false
        }

    } catch (error) {
        console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
        return false
    }
    
}

module.exports = {
    getSelectBYEmpresa,
    getSelectBYIdEmpresa,
    getInsertEmpresa,
    getSelectLastIdEmpresa,
    deleteByIdEmpresa
}
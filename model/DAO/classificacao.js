/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 * document: classificacao.js (responsavel eplo script de classificacao de idade dos filmes)
 ****************************************************************************************/

const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectBYClassificacao = async function (params) {
    try{
        let sql = `select * from tbl_classificacao`

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

const getSelectBYIdClassificacao = async function (id) {
    try{
        let sql = `select * from tbl_classificacao where id_classificacao=${id}`
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
module.exports = {
    getSelectBYClassificacao,
    getSelectBYIdClassificacao
}

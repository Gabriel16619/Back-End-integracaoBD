/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 * document: diretor.js (responsavel pelo script das empresas que criaram os filmes ex: Marvel, DC etc)
 ****************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

//Retorna todos os filmes do banco de dados 
const getSelectAllDiretor = async function () {
    try {
        //Script SQL 
        let sql = `select * from tbl_diretor order by id_diretor desc`
        console.log(sql)
        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result)
        /*  if (result.length > 0 ) */
        //validação para identificar se o retorno do banco e um array, vazio ou com dados
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

//Retorna um filme filtrando pelo ID do banco de dados 
const getSelectByIdDiretor = async function (id) {
    try {
        //Script SQL 
        let sql = `select * from tbl_diretor where id_diretor=${id}`

        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
        /* console.log(result) */
        /*  if (result.length > 0 ) */
        //validação para identificar se o retorno do baco e um array, vazio ou com dados
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

const getSelectLastIdDiretor = async function (params) {

    try {
        //Script SQL 
        let sql = `select id_diretor from tbl_diretor order by id_diretor desc limit 1`

       
        //Executa no BD o script SQL
        let result = await prisma.$queryRawUnsafe(sql)
        console.log(result)

        /*  if (result.length > 0 ) */
        //validação para identificar se o retorno do banco e um array, vazio ou com dados

        if (Array.isArray(result)) {
            return Number(result[0].id_diretor)
        } else {
            return false
        }

    } catch (error) {
        console.log(error) //usar para achar o erro, se a API retornar erro 500, caso o erro for no banco de dados (se vira pra resolver kkkk)
        return false
    }
    
}

//Insere um filme no banco de dados 
const setInsertDiretor = async function (diretor) {
    try {
        let sql = `INSERT INTO tbl_diretor (
        nome, 
        biografia, 
        local_nascimento)
        VALUES ('${diretor.nome}',
                '${diretor.biografia}',
                '${diretor.local_nascimento}'
                    )`

        //$executeRawUnsafe()  -> permite apenas executar scripts sql que não tem retorno de dados (INSERT, UPDATE, DELETE)
           console.log(sql)
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

//Atualiza um filme existente no bando de dados filrando pelo ID
const setUpdateDiretor = async function (diretor) {

    try {
        let sql = `update tbl_diretor set
        nome                = '${diretor.nome}',
        biografia             = '${diretor.biografia}',
        local_nascimento     = '${diretor.local_nascimento}'

        where id = ${diretor.id_diretor}`


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

//Apaga um filme existente no banco de dados filtrando pelo ID 
const setDeleteDiretor = async function (id) {

    try {
        let sql = `DELETE FROM tbl_diretor where id_diretor = ${id}`

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
    getSelectAllDiretor,
    getSelectByIdDiretor,
    setInsertDiretor,
    setUpdateDiretor,
    setDeleteDiretor,
    getSelectLastIdDiretor
}
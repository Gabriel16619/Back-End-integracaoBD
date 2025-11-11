/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 04/11/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 ****************************************************************************************/

//Import da biblioteca do PrismaClient
const { PrismaClient } = require('../../generated/prisma')

//Cria um objeto do prisma client para manipular os scripts SQL
const prisma = new PrismaClient()

const getSelectAllPais = async function () {
    try{
        let sql = `select * from tbl_pais order by id_pais desc`

        let result = await prisma.$queryRawUnsafe(sql)

        if (Array.isArray(result)){
            return result
        }
    }catch(error){
        return false
    } 
}

const getSelectByIdPais = async function (id) {
    
    try{
        let sql = `select * from tbl_pais where id_pais = ${id}`

        let result = await prisma.$queryRawUnsafe(sql)
        if(Array.isArray(result)){
            return result
        }else{
            return false
        }

    }catch(error){
        return error
    }
}

const insertPais = async function (pais) {
    try{
        let sql = `insert into tbl_pais (nome, continente
        )values(
        ('${pais.nome}',
        ${pais.continente}
        )`;

        console.log(sql, "AAAA");
        

        let result = await prisma.$executeRawUnsafe(sql)

        if(result){
            return true
        }else{
            return false
        }
    }catch(error){
        console.log(error, "AAAA");
        return error
    }
}

module.exports = {
    getSelectAllPais,
    getSelectByIdPais,
    insertPais
}
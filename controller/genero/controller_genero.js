/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL
 * Data: 01/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.1
 * document: Genero.js (todas as funcoes voltadas aos generos de filmes vão se encontrar nese documento)
 ****************************************************************************************/
const generoDAO = require('../../model/DAO/genero.js')
const MESSAGE_DEFAULT = require('../filmes/modulo/config_messages.js')

//retorna os tipos de generos de filme
const listarGenero = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await generoDAO.getSelectBYGenero()
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.genero = result

                return MESSAGE.HEADER //200
            } else {

                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return ERROR_INERNAL_SERVER_MODEL //500
        }
    } catch (eror) {
        return MESSAGE.ERROR_INERNAL_SERVER_CONTROLLER
    }
}

//busca os generos por id
const buscarGeneroId = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let result = await generoDAO.getSelectBYIdGenero(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.genero = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGE.ERROR_INERNAL_SERVER_MODEL
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido' //400
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INERNAL_SERVER_CONTROLLER //500
    }
}

//inseir um novo genero
const inserirGenero = async function (genero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosGenero(genero)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme
                let result = await generoDAO.getInsertGenero(genero)


                if (result) {

                    //chama a função para receber o id gerado no banco de dados
                    let lastIdGenero = await generoDAO.getSelectLastIdGenero()

                    if (lastIdGenero) {

                        //adiciona no Json de gebero o ID que foi gerado no BD

                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.response = genero

                        return MESSAGE.HEADER
                    } else {
                        console.log("BBBBBBB")
                        return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
                    }

                } else {

                    return MESSAGE.ERROR_INERNAL_SERVER_MODEL//500
                }

            } else {
                return validarDados //erro 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {
        console.log(error, "AAAAAAAAAAA")

        return MESSAGE_DEFAULT.ERROR_INERNAL_SERVER_CONTROLLER //500

    }

}



const validarDadosGenero = async function (genero) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (genero.nome == '' || genero.nome == null || genero.nome == undefined || genero.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (genero.descricao == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DESCRICAO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else {
        return false
    }
}

//buscar o ultimo Id cadastrado
const buscarUltimoId = async function (genero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosGenero(genero)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme
                let result = await generoDAO.setInsertGenero(genero)

                if (result) {

                    //chama a função para receber o id gerado no banco de dados
                    let lastIdGenero = await filmeDAO.getSelectBYIdGenero()

                    if (lastIdGenero) {

                        //adiciona no Json de filme o ID que foi gerado no BD
                        genero.id = lastIdGenero
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                        MESSAGE.HEADER.response = genero

                        return MESSAGE.HEADER
                    } else {
                        return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
                    }

                } else {
                    return MESSAGE.ERROR_INERNAL_SERVER_MODEL//500
                }

            } else {
                return validarDados //erro 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {

        return MESSAGE_DEFAULT.ERROR_INERNAL_SERVER_CONTROLLER //500

    }

}


module.exports = {
    listarGenero,
    buscarGeneroId,
    inserirGenero,
    validarDadosGenero
}

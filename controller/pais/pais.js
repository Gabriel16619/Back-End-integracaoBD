/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 04/11/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 ****************************************************************************************/

const paisDAO = require ('../../model/DAO/pais.js')
const { ERROR_INERNAL_SERVER_MODEL } = require('../filmes/modulo/config_messages.js')
const MESSAGE_DEFAULT = require('../filmes/modulo/config_messages.js')

const listarPais = async function () {
      let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
      try {
        let result = await paisDAO.getSelectAllPais()

        if(result){
            if (result.length > 0){
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = result

                return MESSAGE.HEADER
            }else{
                return MESSAGE.ERROR_NOT_FOUND
            }
        }else {
            return ERROR_INERNAL_SERVER_MODEL
        }

      }catch(error){
        return MESSAGE.ERROR_ITERNAL_SERVER_CONTROLLER
      }
}

const buscarPaisId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try{

        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0){

             let result = await paisDAO.getSelectByIdPais(parseInt(id))

            if(result){
                if (result.length > 0){

                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.film = result

                console.log(result, "AAAAA")
                return MESSAGE.HEADER   //200
            }else{
                return MESSAGE.HEADER
            }
        }else{
            return MESSAGE.ERROR_INERNAL_SERVER_MODEL
        }        
        }else{
            MESSAGE.ERROR.REQUIRED_FIELDS.invalid_field = 'Atributo [ID] com problemas'
            return MESSAGE.ERROR.REQUIRED_FIELDS // 400
        }
    }catch(error){
        console.log(error, "AAAAAS")
        return MESSAGE.ERROR_ITERNAL_SERVER_CONTROLLER
    }
}

const inserirPais = async function (pais, contentType) {
      let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
      try{
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let validarDados = await validarDadosPais(pais)

            if(!validarDados){
                let result = await paisDAO.insertPais()

                if(result){
                    let lastIdPais = await paisDAO.getSelectByIdPais()
                    if(lastIdPais){

                        pais.id                    =  lastIdPais
                        MESSAGE.HEADER.status       = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code  = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message      = MESSAGE.SUCCES_CREATED_ITEM.message
                        MESSAGE.HEADER.response     = pais

                        return MESSAGE.HEADER
                    }else{
                        return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
                    }
                }  else{
                    return MESSAGE.ERROR_INERNAL_SERVER_MODEL
                }
            }else{
                return validarDados // erro 400
            }
        }else{
            return MESSAGE.ERROR_CONTENT_TYPE
        }

      }catch(error){
        return MESSAGE_DEFAULT.ERROR_INERNAL_SERVER_CONTROLLER //500
      }
    
}
const validarDadosPais = async function (pais) {
    if (pais.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

}else if(pais.continente == undefined) {
    MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SINOPSE] inválido!!!'
    return MESSAGE.ERROR_REQUIRED_FIELDS//400

}else {
    return false
}
}

module.exports ={
listarPais,
buscarPaisId,
inserirPais
}


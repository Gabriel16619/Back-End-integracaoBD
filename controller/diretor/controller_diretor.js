/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 * document: controleer_autor.js (responsavel pelo script dos autores)
 ****************************************************************************************/

const { request } = require('express')
const diretorDAO = require('../../model/DAO/diretor.js')
/* const { buscarFilmeId } = require('../filmes/controller_filmes.js') */
const MESSAGE_DEFAULT = require('../filmes/modulo/config_messages.js')

// lista todas as empresas
const listarDiretor = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await diretorDAO.getSelectAllDiretor()
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.diretor = result

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

// busca a empresa por id
const diretorId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let result = await diretorDAO.getSelectByIdDiretor(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.diretor = result

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

// inserir Diretor
 const inserirDiretor = async function (diretor, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosDiretor(diretor)
            console.log(dadosValidos, "dados validos")
            if (!dadosValidos){
                
              let result = await diretorDAO.setInsertDiretor(diretor)
                console.log(result, "deu certo aqui")
            if (result) {
                
                let lastIdDiretor = await diretorDAO.getSelectLastIdDiretor()

                console.log(lastIdDiretor, "aqui")
                if (lastIdDiretor) {

                    //adiciona no Json de filme o ID que foi gerado no BD
                    diretor.id = lastIdDiretor
                    MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                    MESSAGE.HEADER.response = diretor

                   
                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
                }
            } else {
                return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
            }
        } else {
            return dadosValidos
        }
    }
}catch (eror){
    return MESSAGE_DEFAULT.ERROR_INERNAL_SERVER_CONTROLLER //500
}
}

const deletarDiretor = async function (id) {
    
    //apaga um filme filtrando pelo id
        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
     try{
    
        if(id != '' && id!= null && id != undefined && !isNaN(id)){
    
            let excluirDiretor = await diretorId(id)
           
            if (excluirDiretor.status_code == 200) {
            /*     console.log(excluirEmpresa, "AAAAAAAS") */
             
            let result = await diretorDAO.setDeleteDiretor(parseInt(id))
         if(result){
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message
    
        
            return MESSAGE.HEADER
         }else{
            return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
         }
         }else{
           return excluirDiretor
           
         }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
     }catch(error){
        return MESSAGE.ERROR_INERNAL_SERVER_MODEL
     }
}

// valida os dados para inserir uma autor
const validarDadosDiretor = async function (diretor) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (diretor.nome == '' || diretor.nome == null || diretor.nome == undefined || diretor.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (diretor.local_nascimento == '' || diretor.local_nascimento == null || diretor.local_nascimento == undefined || diretor.local_nascimento.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [localidade] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (diretor.biografia == '' || diretor.biografia == null || diretor.biografia == undefined || diretor.biografia.length > 800) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Biografia] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    }else{
        return false
    }

}
module.exports = {
    listarDiretor,
    diretorId,
    inserirDiretor,
    deletarDiretor
}
/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 * document: controleer_autor.js (responsavel pelo script dos autores)
 ****************************************************************************************/

const { request } = require('express')
const autorDAO = require('../../model/DAO/autor.js')
/* const { buscarFilmeId } = require('../filmes/controller_filmes.js') */
const MESSAGE_DEFAULT = require('../filmes/modulo/config_messages.js')

// lista todas as empresas
const listarAutor = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await autorDAO.getSelectBYAutor()
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.autor = result

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
const autorId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let result = await autorDAO.getSelectBYIdAutor(parseInt(id))
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.autor = result

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

// inserir empresa
 const inserirAutor = async function (autor, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosAutor(autor)

            if (!dadosValidos){
                
              let result = await autorDAO.getInsertAutor(autor)
                console.log(result, "deu certo aqui")
            if (result) {
                
                let lastIdAutor = await autorDAO.getSelectLastIdAutor()

                console.log(lastIdAutor, "aqui")
                if (lastIdAutor) {

                    //adiciona no Json de filme o ID que foi gerado no BD
                    autor.id = lastIdAutor
                    MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                    MESSAGE.HEADER.response = autor

                    console.log(lastIdAutor, "aqui")
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

const deletarAutor = async function (id) {
    
    //apaga um filme filtrando pelo id
        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
     try{
    
        if(id != '' && id!= null && id != undefined && !isNaN(id)){
    
            let excluirAutor = await autorId(id)
           
            if (excluirAutor.status_code == 200) {
            /*     console.log(excluirEmpresa, "AAAAAAAS") */
             
            let result = await autorDAO.deleteByIdAutor(parseInt(id))
         if(result){
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message
    
        
            return MESSAGE.HEADER
         }else{
            return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
         }
         }else{
           return excluirAutor
           
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
const validarDadosAutor = async function (autor) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (autor.nome == '' || autor.nome == null || autor.nome == undefined || autor.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (autor.local_nascimento == '' || autor.local_nascimento == null || autor.local_nascimento == undefined || autor.local_nascimento.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [localidade] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (autor.biografia == '' || autor.biografia == null || autor.biografia == undefined || autor.biografia.length > 800) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Descricao] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    }else{
        return false
    }

}
module.exports = {
    listarAutor,
    autorId,
    inserirAutor,
    deletarAutor
}
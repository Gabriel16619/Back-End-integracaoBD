/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD no Banco de Dados MySQL
 * Data: 29/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 * document: empresa.js (responsavel pelo script das empresas que criaram os filmes ex: Marvel, DC etc)
 ****************************************************************************************/

const empresaDAO = require('../../model/DAO/empresa.js')
const { buscarFilmeId } = require('../filmes/controller_filmes.js')
const MESSAGE_DEFAULT = require('../filmes/modulo/config_messages.js')

// lista todas as empresas
const listarEmpresa = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await empresaDAO.getSelectBYEmpresa()
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

// busca a empresa por id
const empresaId = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let result = await empresaDAO.getSelectBYIdEmpresa(parseInt(id))
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

// inserir empresa
 const inserirEmpresa = async function (empresa, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let dadosValidos = await validarDadosEmpresa(empresa)

            if (!dadosValidos){
                console.log(dadosValidos, "BBBBB")
            if (result) {
                console.log(result, "CCCCCC")
                let lastIdEmpresa = await empresaDAO.getInsertEmpresa()

                if (lastIdEmpresa) {

                    //adiciona no Json de filme o ID que foi gerado no BD
                    empresa.id = lastIdEmpresa
                    MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message
                    MESSAGE.HEADER.response = empresa

                    console.log(lastIdEmpresa, "CCCCCC")
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
    console.log(eror)
    return MESSAGE_DEFAULT.ERROR_INERNAL_SERVER_CONTROLLER //500
}
}

const deletarEmpresa = async function (id) {
    
    //apaga um filme filtrando pelo id
        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
     try{
    
        if(id != '' && id!= null && id != undefined && !isNaN(id)){
    
            let excluirEmpresa = await empresaId(id)
           
            if (excluirEmpresa.status_code == 200) {
            /*     console.log(excluirEmpresa, "AAAAAAAS") */
             
            let result = await empresaDAO.deleteByIdEmpresa(parseInt(id))
         if(result){
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message
    
        
            return MESSAGE.HEADER
         }else{
            return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
         }
         }else{
           return excluirEmpresa
           
         }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
     }catch(error){
        return MESSAGE.ERROR_INERNAL_SERVER_MODEL
     }
}

// valida os dados para inserir uma empresa
const validarDadosEmpresa = async function (empresa) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (empresa.nome == '' || empresa.nome == null || empresa.nome == undefined || empresa.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (empresa.localidade == '' || empresa.localidade == null || empresa.localidade == undefined || empresa.localidade.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [localidade] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (empresa.descricao == '' || empresa.descricao == null || empresa.descricao == undefined || empresa.descricao.length > 800) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [Descricao] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (empresa.data_fundacao == '' || empresa.data_fundacao.length > 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [data_fundação] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (empresa.data_fechamento == undefined || empresa.data_fechamento.length > 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [data_fechamento] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (empresa.fundador_empresa == '' || empresa.fundador_empresa == null || empresa.fundador_empresa == undefined || empresa.fundador_empresa.length > 50) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [data_fechamento] inválido'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400
    }else{
        return false
    }

}
module.exports = {
    listarEmpresa,
    empresaId,
    validarDadosEmpresa,
    inserirEmpresa,
    deletarEmpresa
}
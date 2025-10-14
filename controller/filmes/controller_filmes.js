/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 07/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 ****************************************************************************************/
//import do arquivo DAO para manipulr o CRUD no  BD
const filmeDAO = require('../../model/DAO/filme.js')
const MESSAGE_DEFAULT = require('./modulo/config_messages.js')

//retona uma lista de filmes
const listarFilmes = async function () {

    //Realizando uma copia do objeto MESSAGE_DEFAULT, permitindo que as alteraço~es desssa função
    //não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        /* console.log(MESSAGE) */
        let result = await filmeDAO.getSelectAllFilms()
        /* console.log(result) */
        if (result) {
            if (result.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.films = result

                return MESSAGE.HEADER //200
            } else {
                return MESSAGE.ERROR_NOT_FOUND //404
            }
        } else {
            return ERROR_INERNAL_SERVER_MODEL //500
        }
    } catch (eror) {
        return MESSAGE.ERROR_INERNAL_SERVER_CONTROLLER //500
    }
}


//retorna um filme filtrando pelo id
const buscarFilmeId = async function (id) {

    //Realizando uma copia do objeto MESSAGE_DEFAULT, permitindo que as alteraço~es desssa função
    //não interfira em outras funções
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
   
    try {
        //Validaçaõ de campo obrigatório
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            //Chama a função para filtrar pelo ID
            let result = await filmeDAO.getSelectByIdFilms(parseInt(id))
           
            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.film = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND //404
                }

            } else {
                return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
            }
        } else {
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (eror) {
        return MESSAGE.ERROR_INERNAL_SERVER_CONTROLLER //500
       
    }
}

//inseri um novo filme 
const inserirFilme = async function (filme, contentType) {
let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

try{

    if(String(contentType).toUpperCase() == 'APPLICATION/JSON'){

        if(filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100){
                MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
                return MESSAGE.ERROR_REQUIRED_FIELDS//400

        }else if(filme.sinopse == undefined){
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SINOPSE] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS//400

        }else if(filme.data_lancamento == undefined || filme.data_lancamento.length != 10){
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA LANÇAMENTO] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS

        }else if (filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8){
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DURAÇÃO] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS//400

        }else if(filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || filme.orcamento.length > 13 || typeof(filme.orcamento) != 'number'){
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ORÇAMENTO] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS

        }else if (filme.trailer == undefined || filme.trailer.length > 200){
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [TRAILER] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS//400

        }else if (filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length >200 ){
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CAPA] inválido!!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS//400

        }else{
            //processamento verdadeiros
            //Chama a função do DAO para inserir um novo filme
            let result = await filmeDAO.setInsertFilms(filme)

            if(result ){
                MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message 

                return MESSAGE.HEADER
            }else{
                return MESSAGE.ERROR_INERNAL_SERVER_MODEL//500
            }

        }
     }else{
        return MESSAGE.ERROR_CONTENT_TYPE //415
}
}catch(error){
    
    return MESSAGE_DEFAULT.ERROR_INERNAL_SERVER_CONTROLLER //500

}

}
//atualiza um filme filtrando pelo id
const atualizarFilme = async function (filme, id) {

}
//apaga um filme filtrando pelo id
const excluirFilme = async function (id) {

}


module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme
}
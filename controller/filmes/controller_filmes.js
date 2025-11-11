/****************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados entreo App e a Model 
 *           (validações, tratamento de dados, tratamento de errros, etc)
 * Data: 07/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.0
 ****************************************************************************************/
//import do arquivo DAO para manipulr o CRUD no  BD
const filmeDAO = require('../../model/DAO/filme.js')

//import da controller_filme_genero
const controller_filme_genero = require('./controller_filme_genero.js')

//import das messages
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

               /*  let arrayFilmes = [] */
                //processamento para adicionar os generos em cada filme
                for(filme of result){
                    console.log(filme, "1")
                    let resultGeneros = await controller_filme_genero.listarGenerosIdFilme(filme.id)
                    console.log(resultGeneros, "chegou aqui 2")
                 if(resultGeneros.status_code == 200){
                filme.genero = resultGeneros.response.filmes_generos 

                // tratativa para os filmes sem genero
                 }/* else if (filme.genero == null) {
                    let arrayNull = []
                    return arrayNull
                 } */
                }
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
        console.log(eror)
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
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido' //400
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }

    } catch (eror) {
        return MESSAGE.ERROR_INERNAL_SERVER_CONTROLLER //500

    }
}

//inseri um novo filme 
const inserirFilme = async function (filme, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if (!validarDados) {

                //Chama a função do DAO para inserir um novo filme
                let result = await filmeDAO.setInsertFilms(filme)


                if (result) {

                    //chama a função para receber o id gerado no banco de dados
                    let lastIdFIlme = await filmeDAO.getSelectLastIdFilms()

                    if (lastIdFIlme) {

                        // processamento para inserir dados na tabela de relção entre filme e genero
                        //Repetição para pegar cada genero e enviar para o DAO do filmeGenero
                       /*  filme.genero.forEach(async function(genero) { */
                       for(genero of filme.genero){
                            let filmeGenero =   { 
                                                id: lastIdFIlme, 
                                                id_genero: genero.id
                                                }

                            let resultFilmeGenero = await controller_filme_genero.inserirFilmeGenero(filmeGenero, contentType)

                            if(resultFilmeGenero.status_code != 201)
                                return MESSAGE.ERROR_RELATION_TABLE //200 porem com problemas na tabela de relação
                        };

                        //adiciona no Json de filme o ID que foi gerado no BD
                        filme.id = lastIdFIlme
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_CREATED_ITEM.message

                        //processamento para trazer dados dos generos cadastrados na tabela de relação
                        delete filme.genero
                        //pesquisa o no bd quai os generos e o seus dados que foram inseridos na tabela de relação
                        let resultGenerosFilme = await controller_filme_genero.listarGenerosIdFilme(lastIdFIlme)

                        //adiciona novamente o atributo genero comtodas as informação es inseridas na tabela relacionamento (ID, Nome)
                        filme.genero = resultGenerosFilme.response.filmes_generos


                        MESSAGE.HEADER.response = filme

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

//atualiza um filme filtrando pelo id
const atualizarFilme = async function (filme, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filme)

            if (!validarDados) {

                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await buscarFilmeId(id)

                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {

                    //adicionando o id no json com os dados do filme
                    filme.id = parseInt(id)

                    //Chama a função do DAO para atualizar um novo filme
                    let result = await filmeDAO.setUpdateFilms(filme)

                    if (result) {


                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = filme

                        return MESSAGE.HEADER
                    } else {

                        return MESSAGE.ERROR_INERNAL_SERVER_MODEL//500
                    }
                } else {

                    return validarId // retorno da funçaõ de buscarFilmeId (400 ou 404 ou 500)
                }

            } else {
                return validarDados //retorno da funçaõ de valodar dados do filme 400
            }
        } else {
            return MESSAGE.ERROR_CONTENT_TYPE //415
        }
    } catch (error) {

        return MESSAGE_DEFAULT.ERROR_INERNAL_SERVER_CONTROLLER //500

    }


}

//apaga um filme filtrando pelo id
const excluirFilme = async function (id) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (id != '' && id != null && id != undefined && !isNaN(id)) {

            let excluirFilme = await buscarFilmeId(id)

            if (excluirFilme.status_code == 200) {
                let result = await filmeDAO.setDeleteFilms(parseInt(id))
                if (result) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
                    MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message


                    return MESSAGE.HEADER
                } else {
                    return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
                }
            } else {
                return excluirFilme
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
    } catch (error) {

        return MESSAGE.ERROR_INERNAL_SERVER_MODEL
    }
}

//validação dos dados de cadatro do filme
const validarDadosFilme = async function (filme) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    if (filme.nome == '' || filme.nome == null || filme.nome == undefined || filme.nome.length > 100) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [NOME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (filme.sinopse == undefined) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [SINOPSE] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (filme.data_lancamento == undefined || filme.data_lancamento.length != 10) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DATA LANÇAMENTO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (filme.duracao == '' || filme.duracao == null || filme.duracao == undefined || filme.duracao.length > 8) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [DURAÇÃO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (filme.orcamento == '' || filme.orcamento == null || filme.orcamento == undefined || filme.orcamento.length > 13 || typeof (filme.orcamento) != 'number') {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ORÇAMENTO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS

    } else if (filme.trailer == undefined || filme.trailer.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [TRAILER] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (filme.capa == '' || filme.capa == null || filme.capa == undefined || filme.capa.length > 200) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [CAPA] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else {
        return false
    }
}

module.exports = {
    listarFilmes,
    buscarFilmeId,
    inserirFilme,
    atualizarFilme,
    excluirFilme,
}
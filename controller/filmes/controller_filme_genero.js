/****************************************************************************************
 * Objetivo: Arquivo responsável pela realização de dados entre app e model para o crud de filme e genero 
 * Data: 05/10/2025
 * Autor: Gabriel Cavalcante
 * Versão: 1.1
 * document: Genero.js (todas as funcoes voltadas aos generos de filmes vão se encontrar nese documento)
 ****************************************************************************************/
const filme_generoDAO = require('../../model/DAO/filme_genero.js')
const MESSAGE_DEFAULT = require('../filmes/modulo/config_messages.js')

//retorna os tipos de generos de filme
const listarFilmesGeneros = async function () {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        let result = await filme_generoDAO.getSelectAllFilmesGenre()

        if (result) {
            if (resultFilmeGeneros.length > 0) {
                MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                MESSAGE.HEADER.response.filmes_generos = result

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

//busca um filme genero filtrando pelo id
const buscarFilmeGeneroId = async function (id) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (id != '' && id != null && id != undefined && !isNaN(id) && id > 0) {

            let result = await filme_generoDAO.getSelectBYIdGenre(parseInt(id))

            if (result) {
                if (resultFilmeGeneros.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmes_generos = result

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

// retorna os generos filtrando pelo id do filme
const listarGenerosIdFilme = async function (idFilme) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (idFilme != '' && idFilme != null && idFilme != undefined && !isNaN(idFilme) && idFilme > 0) {

            let result = await filme_generoDAO.getSelectGenresBYIdFilm(parseInt(idFilme))

            if (result) {
                if (result.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmes_generos = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGE.ERROR_INERNAL_SERVER_MODEL
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_FILME] inválido' //400
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INERNAL_SERVER_CONTROLLER //500
    }
}

// retorna os filmes filtrando pelo id do genero
const listarFilmeIdGenero = async function (idGenero) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {
        if (idGenero != '' && idGenero != null && idGenero != undefined && !isNaN(idGenero) && id > 0) {

            let result = await filme_generoDAO.getSelectGenresBYIdFilm(parseInt(idGenero))

            if (result) {
                if (resultFilmeGeneros.length > 0) {
                    MESSAGE.HEADER.status = MESSAGE.SUCCESS_REQUEST.status
                    MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_REQUEST.status_code
                    MESSAGE.HEADER.response.filmes_generos = result

                    return MESSAGE.HEADER //200
                } else {
                    return MESSAGE.ERROR_NOT_FOUND
                }
            } else {
                return MESSAGE.ERROR_INERNAL_SERVER_MODEL
            }
        } else {
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID_GENERO] inválido' //400
            return MESSAGE.ERROR_REQUIRED_FIELDS //400
        }
    } catch (error) {
        console.log(error)
        return MESSAGE.ERROR_INERNAL_SERVER_CONTROLLER //500
    }
}

//inseir um novo genero
const inserirFilmeGenero = async function (FilmeGenero, contentType) {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilmeGenero(FilmeGenero)
           console.log(validarDados, "erro do validar dados") 

            if (!validarDados) {
                console.log(validarDados, 'esta vindo aqui no validarDados')
                //Chama a função do DAO para inserir um novo filme
                let result = await filme_generoDAO.setInsertFilmGenre(FilmeGenero)
            

                if (result) {
            
                    //chama a função para receber o id gerado no banco de dados
                    let lastIdFilmeGenero = await filme_generoDAO.getSelectLastId()
                    console.log(lastIdFilmeGenero, "erro no lastid")

                    if (lastIdFilmeGenero) {

                        //adiciona no Json de gebero o ID que foi gerado no BD
                        FilmeGenero.id = lastIdFilmeGenero
                        MESSAGE.HEADER.status = MESSAGE.SUCCES_CREATED_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_CREATED_ITEM.status_code
                        MESSAGE.HEADER.response = FilmeGenero

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

// ver depois
const atualizarFilmeGenero = async function (filmeGenero, id, contentType) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    try {

        //validção do content-type
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            //chama a função de validação dos dados de cadastro
            let validarDados = await validarDadosFilme(filmeGenero)

            if (!validarDados) {

                //chama a função para validar a consistencia do id e verificar se existe no banco de dados
                let validarId = await buscarFilmeId(id)

                //verifica se o id existe no BD, caso exista teremos o status 200
                if (validarId.status_code == 200) {

                    //adicionando o id no json com os dados do filme
                    filme.id = parseInt(id)

                    //Chama a função do DAO para atualizar um novo filme
                    let result = await filme_generoDAO.getSelectLastId(filmeGenero)

                    if (result) {


                        MESSAGE.HEADER.status = MESSAGE.SUCCES_UPDATE_ITEM.status
                        MESSAGE.HEADER.status_code = MESSAGE.SUCCES_UPDATE_ITEM.status_code
                        MESSAGE.HEADER.message = MESSAGE.SUCCES_UPDATE_ITEM.message
                        MESSAGE.HEADER.response = filmeGenero

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

const deletarFilmeGenero = async function (id) {
    
    //apaga um filme filtrando pelo id
        let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    
     try{
    
        if(id != '' && id!= null && id != undefined && !isNaN(id)){
    
            let excluirFilmeGenero = await filmeGeneroId(id)
           
            if (excluirFilmeGenero.status_code == 200) {
            /*     console.log(excluirEmpresa, "AAAAAAAS") */
             
            let result = await filme_generoDAO.setDeleteFilmsGenre(parseInt(id))
         if(result){
            MESSAGE.HEADER.status = MESSAGE.SUCCESS_DELETE_ITEM.status
            MESSAGE.HEADER.status_code = MESSAGE.SUCCESS_DELETE_ITEM.status_code
            MESSAGE.HEADER.message = MESSAGE.SUCCESS_DELETE_ITEM.message
    
        delete MESSAGE.HEADER.response
         }else{
            return MESSAGE.ERROR_INERNAL_SERVER_MODEL //500
         }
         }else{
           return excluirFilmeGenero
           
         }
        }else{
            MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [ID] inválido!!'
            return MESSAGE.ERROR_REQUIRED_FIELDS // 400
        }
     }catch(error){
        return MESSAGE.ERROR_INERNAL_SERVER_MODEL
     }
}

const validarDadosFilmeGenero = async function (filmeGenero) {

    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))

    console.log(filmeGenero.id)

    // id e por conta ado meu bd que eu coloquei como id, mas caso de erro eu troco para id_filme

    if (filmeGenero.id == '' || filmeGenero.id == null || filmeGenero.id == undefined || isNaN(filmeGenero.id) || filmeGenero.id <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [FILME] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else if (filmeGenero.id_genero == '' || filmeGenero.id_genero == null || filmeGenero.id_genero == undefined ||filmeGenero.id_genero.length <= 0) {
        MESSAGE.ERROR_REQUIRED_FIELDS.invalid_field = 'Atributo [GENERO] inválido!!!'
        return MESSAGE.ERROR_REQUIRED_FIELDS//400

    } else {
        return false
    }
}

module.exports = {
listarFilmesGeneros,
buscarFilmeGeneroId,
listarGenerosIdFilme,
listarFilmeIdGenero,
inserirFilmeGenero,
atualizarFilmeGenero,
deletarFilmeGenero,
validarDadosFilmeGenero
}
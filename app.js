/**************************************************
*Descrição:  
* nome: Gabriel Cavalcante dos Santos
 * data: 07/10/2025
 * versão:1.0.0
 **************************************************/

//expost das dependencias
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

//Cria um objeto especialista no formato json para receber os dados do body (POST e PUT)
const bodyParserJSON = bodyParser.json()


const app = express()

//define a porta padrão da API
const PORT = process.PORT || 8080



app.use((request, response, next) => {
    response.header('Acess-Control-Allow_Origin', '*')
    response.header('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())
    next()//proximo
})
const controllerFilme = require('./controller/filmes/controller_filmes.js')
//Endpoint para CRUD  de filmes

//retorna a lista de filmes
app.get('/v1/locadora/filme', cors(), async function (req, res) {
    //chama a função da controller para retornar todos os filmes
    let filme = await controllerFilme.listarFilmes()
    
    res.status(filme.status_code)
    res.json(filme)
})

//retorna um filme filtrando pelo id
app.get('/v1/locadora/filme/:id', cors(), async function (req, res) {
    
    let  idFilme = req.params.id
//recebe o id enviado na requisição por id
    let filme = await controllerFilme.buscarFilmeId(idFilme)
    res.status(filme.status_code)
    res.json(filme)
})

//insere um novo filme no banco de dados
app.post('/v1/locadora/filme', cors(), bodyParserJSON, async function (req, res){

    //recebec o objeto json pelo body da requisição
    let dadosBody = req.body
    let contentType = req.headers['content-type']

    //chama a função da controller para inserir filme, enviamos os dados do body e o content-type
    /* console.log(filme) */
    let filme = await controllerFilme.inserirFilme(dadosBody, contentType)

    res.status(filme.status_code)
    res.json(filme)
})

app.listen(PORT, function () {
    console.log('API aguardando requisição')
})

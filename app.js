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
const controllerGenero = require('./controller/genero/controller_genero.js')
const controllerClassificacao = require('./controller/classificacao/classificacao.js')
const controllerEmpresa =  require('./controller/empresa/empresa.js')
const controllerPais = require('./controller/pais/pais.js')
const controllerAutor = require('./controller/autor/crontroller_autor.js')
//Endpoint para CRUD  de filmes


/**********************************************************************************************************************/
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

//retorna os generos
app.get('/v1/locadora/genero', cors(), async function (req, res) {

    //chama a função da controller para retornar todos os generos
    /* console.log(genero, "aaaaaaa") */
    let genero = await controllerGenero.listarGenero()

    res.status(genero.status_code)
    res.json(genero)
})

app.get('/v1/locadora/genero/:id', cors(), async function (req, res) {
    let idGenero = req.params.id
    //recebece o id enviado pela requisição
    let genero = await controllerGenero.buscarGeneroId(idGenero)
    res.status(genero.status_code)
    res.json(genero)
})

//retorna as classificões
app.get('/v1/locadora/classificacao', cors(), async function (req, res) {
    let classificacao = await controllerClassificacao.listarclassificacao()
    res.status(classificacao.status_code)
    res.json(classificacao)
})

app.get('/v1/locadora/classificacao/:id', cors(), async function (req, res) {
    let idClassificacao = req.params.id
    let Classificacao = await controllerClassificacao.buscarclassificacaoId(idClassificacao)
    res.status(Classificacao.status_code)
    res.json(Classificacao)
})

app.get('/v1/locadora/empresa', cors(), async function (req, res) {
    let empresa = await controllerEmpresa.listarEmpresa()
    res.status(empresa.status_code)
    res.json(empresa)
})

app.get('/v1/locadora/empresa/:id', cors(), async function (req, res) {
    let idEmpresa = req.params.id
    let empresa = await controllerEmpresa.empresaId(idEmpresa)
    res.status(empresa.status_code)
    res.json(empresa)
})

app.get('/v1/locadora/pais', cors(), async function (req, res) {
    let pais = await controllerPais.listarPais()
    res.status(pais.status_code)
    res.json(pais)
})

app.get('/v1/locadora/pais/:id', cors(), async function (req, res) {
    let idPais = req.params.id
    let pais = await controllerPais.buscarPaisId(idPais)
    console.log(pais, "AAAAA")
    res.status(pais.status_code)
    res.json(pais)
})


//retorna lista de autores
app.get('/v1/locadora/autor', cors(), async function (req, res) {
    let autor = await controllerAutor.listarAutor()
    res.status(autor.status_code)
    res.json(autor)
})

//retorna o autor por id

app.get('/v1/locadora/autor/:id', cors(), async function (req, res) {
    
    let  idAutor = req.params.id
//recebe o id enviado na requisição por id
    let autor = await controllerAutor.autorId(idAutor)
    res.status(autor.status_code)
    res.json(autor)
})

// insere uma novo autor
app.post('/v1/locadora/autor', cors(), bodyParserJSON, async function (req, res){
    let dadosBody = req.body
    let contentType = req.headers['content-type']
    let autor = await controllerAutor.inserirAutor(dadosBody, contentType)
    console.log(autor, "App.js")
    res.status(autor.status_code)
    res.json(autor)
})
/*/************************************************************************************************************************/

// insere uma nova empresa
app.post('/v1/locadora/empresa', cors(), bodyParserJSON, async function (req, res){
    let dadosBody = req.body
    let contentType = req.headers['content-type']
    
    let empresa = await controllerEmpresa.inserirEmpresa(dadosBody, contentType)
   console.log(empresa, "AAAAAA")
    res.status(empresa.status_code)
    res.json(empresa)
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

//inserir um novo genero no banco de dados
app.post('/v1/locadora/genero', cors(), bodyParserJSON, async function (req, res) {

    //recebe um objeto pelo body da requisição
    let dadosBody = req.dadosBody
    let contentType = req.headers['content-type']

    //chama a função da controler para inserir filme, enviamos os dados do body e  content type

    let genero = await controllerGenero.inserirGenero(dadosBody, contentType)
    res.status(genero.status_code)
    res.json(genero)
})

app.post('/v1/locadora/pais', cors(), bodyParserJSON, async function (req, res){

    //recebec o objeto json pelo body da requisição
    let dadosBody = req.body
    let contentType = req.headers['content-type']
    let pais = await controllerPais.inserirPais(dadosBody, contentType)
    res.status(pais.status_code)
    res.json(pais)
})

app.put('/v1/locadora/filme/:id', cors(), bodyParserJSON , async function (req, res) {

    //recebe os dados do body
    let dadosBody = req.body

    //recebe o id do filme enaminhado pela URL
    let idFilme = req.params.id

    //recebe o content-type da requisição
    let contentType = req.headers['content-type']

    //Chama a função ´para atualizar o filme
    let filme = await controllerFilme.atualizarFilme(dadosBody, idFilme, contentType)

    res.status(filme.status_code)
    res.json(filme)
})
/****************************************************** */
app.delete('/v1/locadora/filme/:id', cors(), async function (req, res) {
    
    let idFilme = req.params.id
    let filme = await controllerFilme.excluirFilme(idFilme)
    res.status(filme.status_code)
    console.log(filme.status_code)
    res.json(filme)
})

app.delete('/v1/locadora/empresa/:id', cors(), async function (req, res) {
    let idEmpresa = req.params.id
    let dados = await controllerEmpresa.deletarEmpresa(idEmpresa)
    console.log(dados)
    res.status(dados.status_code)
    res.json(dados)
})

app.delete('/v1/locadora/autor/:id', cors(), async function (req, res) {
    
    let idAutor = req.params.id
    let autor = await controllerAutor.deletarAutor(idAutor)
    res.status(autor.status_code)
    console.log(autor.status_code)
    res.json(autor)
})
/************************************************************************ */
//ultima linha do codigo 
app.listen(PORT, function () {
    console.log('API aguardando requisição')
})

//----------* REQUIRE'S *----------//
const express = require('express')
const engine = require('express-handlebars').engine
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const productController = require('./Controllers/productController')
const messagesController = require('./Controllers/messagesController')

//----------* EXPRESS() *----------//
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

//----------* TEMPLATE ENGINE SETUP *----------//
const handlebarsConfig = {
  extname: '.hbs',
  defaultLayout: 'index.html',
}
app.engine('.hbs', engine(handlebarsConfig))
app.set('view engine', '.hbs')

//----------* MIDDLEWARES *----------//
app.set('views', 'src/views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//----------* ROUTES *----------//
app.use('/test', async (req, res) => {
  try {
    console.log('Entro al Server!')
    const allProducts = await productsController.populate()
    console.log('SERVER allProducts', allProducts)
    //res.render('productView.hbs', { allProducts })
    res.sendFile(process.cwd() + '/public/index.html')
  } catch (error) {
    console.log(error)
  }
})

app.use('/', async (req, res) => {
  try {
    console.log('Entro a Home!')
    res.sendFile(process.cwd() + '/public/index.html')
  } catch (error) {
    console.log(error)
  }
})

//----------* SOCKET IO *----------//
io.on('connection', (socket) => {
  socket.emit('socketConnected')

  socket.on('productListRequest', async () => {
    const allProducts = await productController.getAllProducts()
    socket.emit('updateProductList', allProducts)
  })

  socket.on('chatMessagesRequest', async () => {
    const allMessages = await messagesController.getAllMessages()
    socket.emit('updateChatRoom', allMessages)
  })

  socket.on('addNewProduct', async (newProduct) => {
    await productController.addNewProduct(newProduct)
    const allProducts = await productController.getAllProducts()
    socket.emit('addProductToList', allProducts)
  })

  socket.on('addNewMessage', async (newMessage) => {
    await messagesController.addNewMessage(newMessage)
    const allMessages = await messagesController.getAllMessages()
    socket.emit('updateChatRoom', allMessages)
  })
})

//----------* SERVER CONFIGURATION *----------//
const PORT = process.env.PORT || 8080
const server = httpServer.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${server.address().port}/`)
})
server.on('error', (error) => console.log(`Server error: ${error}`))

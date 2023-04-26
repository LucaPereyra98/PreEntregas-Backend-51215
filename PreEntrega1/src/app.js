const express = require('express')
const productRouter = require('./routes/products.routes')
const cartsRouter = require('./routes/carts.routes')
const PORT = 8080
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', productRouter)
app.use('/api', cartsRouter)
app.listen(PORT, () => {
  console.log(`Servidor conectado en el puerto ${PORT}`)
})
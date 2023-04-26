const express = require('express')
const productRouter = require('./routes/products.router')
const cartsRouter = require('./routes/carts.router')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api', productRouter)
app.use('/api', cartsRouter)

const server = app.listen(8080, () => console.log("Listening on 8080"))

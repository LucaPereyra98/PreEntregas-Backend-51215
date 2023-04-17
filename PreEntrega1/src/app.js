// Imports
import express from 'express'
import productsRouter from './routes/products.routers.js'
import cartsRouter from './routes/carts.routers.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/carts/', cartsRouter)
app.use('/api/products/', productsRouter)

const server = app.listen(8080, () => console.log('Listening on 8080'))

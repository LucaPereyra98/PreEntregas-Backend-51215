const express = require('express');
const productsRouter = require('./routes/products.routers.js');
const cartsRouter = require('./routes/carts.routers.js');

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});


app.use('/api/carts/', cartsRouter)
app.use('/api/products/', productsRouter)

const server = app.listen(8080, () => console.log('Listening on 8080'))

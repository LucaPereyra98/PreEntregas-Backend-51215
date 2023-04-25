const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const products= require('../data/products.json')

const router = Router()
// Array vacio inicial
let carts = []

// Funcion para exportar los cambios de productos al archivo JSON de carritos
const exportCartsJSON = (fileName) => {
    const cartsJSON = JSON.stringify(carts)
    const filePath = path.join(__dirname, '../data/carts.json')
    fs.writeFile(filePath, cartsJSON, (err) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            console.log(`The archive ${fileName} has been updated correctly.`)
        }
    })
}

// Funcion para exportar los cambios de productos al archivo JSON de productos
const exportProductsJSON = (fileName) => {
    const productsJSON = JSON.stringify(products)
    const filePath = path.join(__dirname, '../data/products.json')
    fs.writeFile(filePath, productsJSON, (err) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            console.log(`The archive ${fileName} has been updated correctly.`)
        }
    })
}

// SOLICITUDES POSTMAN

// Crear un carrito nuevo
router.post('/', (req, res) => {
    // Se crea un nuevo carrito vacio
    const newCart = { id: carts.length + 1, products: [] }

    // Se recibe un console.log para controlar que el carrito haya sido generado correctamente
    console.log(newCart)

    // Se pushea al array de carritos
    carts.push(newCart)
    
    //Se envia mensaje de exito
    res.send({ status: 'success', message: 'new cart created' })

    // Se exporta el carrito al archivo JSON
    exportCartsJSON('../data/carts.json')
})

// Buscar los productos del carrito determinado por el ID
router.get('/:cid', (req, res) => {
    // Recibir el ID del carrito de la URL
    const cartId = parseInt(req.params.cid) // Se pasa a numero usando "parseInt"

    // Buscar el ID del carrito en el array de carritos
    const cart = carts.find( cart => cart.id ===  cartId )

    // Si el carrito no existe enviar error 404
    if (!cart) {
        const error = { error: 'cart not found' }
        return res.status(404).send(error)
    }

    //Si existe el carrito mostrar los productos del array
    res.send(cart.cartProducts)
})

// Añadir los productos del archivo JSON al carrito especificado por el ID de la URL
router.post('/:cid/product/:pid', (req, res) => {
    // Obtener el ID del carrito al cual se le van a sumar los productos
    const cartId = req.params.cid

    // Obtener el ID de los productos que se van a sumar al carrito
    const productId = req.params.pid

    // Buscar el carrito en el array de carritos
    const cart = carts.find( cart => cart.id === parseInt(cartId) ) // Se pasa a numero usando "parseInt

    // Si el carrito no existe, enviar mensaje de error
    if (!cart) {
        return res.status(404).send('Cart not found')
    }

    // Buscar el producto en el array de productos disponibles dentro del archivo JSON
    const productIndex = products.findIndex( p => p.id === parseInt(productId) )

    // Si el producto no existe enviar un mensaje de error
    if (productIndex === -1 ) {
        return res.status(404).send('Product not found')
    }

    // En caso de existir el producto, reducir la cantidad del producto en el array JSON en 1
    products[productIndex].stock--

    // Verificar si el producto ya existe en el carrito
    const existingProduct = cart.products.find( p => p.product === parseInt(productId))

    //Si el producto existe, incrementar en 1 su cantidad. Si no existe, enviarlo al carrito con cantidad fija de 1.
    if (existingProduct) {
        existingProduct.quantity++
    } else {
        cart.products.push( { product: parseInt(productId), quantity: 1 } )
    }

    // Enviar el carrito con los productos actualizados
    res.send(cart)

    // Actualizar el array de carritos y productos
    exportCartsJSON('../data/carts.json')
    exportProductsJSON('../data/products.json')
})

// Borrar productos del carrito
router.delete('/:cid/products', (req, res) => {
    // Recibir ID del carrito
    const cartId = req.params.cid

    // Buscar el ID del carrito en el carray de carritos
    let cart = carts.find( cart => cart.id ===  parseInt(cartId) )

    // Si el carrito no existe enviar error 404
    if (!cart) {
        const error = { error: 'cart not found' }
        console.log(cartId)
        console.log(cart)
        return res.status(404).send(error)
    }

    // Si existe el carrito, borrar los productos y solamente dejar un array vacio
    cart.products = []

    // Se exporta el carrito al archivo JSON
    exportCartsJSON('../data/carts.json')
    return res.send( { status: "Products successfully deleted" } )
})

module.exports = router
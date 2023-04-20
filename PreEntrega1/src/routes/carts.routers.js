const { Router } = require("express")
const fs = require("fs")
const products = require('../products.json')

const router = Router()
let carts = []
try {
    carts = JSON.parse(fs.readFileSync("carts.json"))
} catch (err) {
    console.log("error loading files in the cart", err)
}

// Exportar productos a JSON
const exportCartsToJSON = (fileName) => {
    const cartsJSON = JSON.stringify(carts)
    const filePath= 'carts.json'
    fs.truncate(filePath, 0, () => {
        fs.writeFile(filePath, cartsJSON, (err) => {
            if (err) {
                throw new Error (`error writing file ${err}`)
            } else {
                console.log(`Products have been successfully added to the file ${fileName}`)
            }
        })
    })
}

// Crear nuevo carrito
router.post ('/', (req, res) => {
    const newCart = {
        id: carts.length + 1,
        products: []
    }
    carts.push(newCart)
    console.log(newCart)
    res.send({status: "success", message: "new cart created"})
    exportCartsToJSON('carts.json')
})

// Buscar productos del carrito por ID
router.get ("/:cid", (req, res) => {
    // Recibir ID del carrito
    const cartId = parseInt(req.params.cid)

    // Buscar el ID en el array
    const cart = carts.find( cart => cart.id === cartId )
    if (!cart) {
        // Si no existe el producto, enviar el error
        const error = {error: 'cart not found'}
        return res.status(404).send(error)
    }

    // Si existe el carrito, mostrar los productos dentro del array
    res.send(cart.products)
}) 

router.post('/:cid/product/:pid', function(req, res) {
    // Obtener el id del carrito y del producto de los parámetros de la solicitud
    const cartId = req.params.cid
    const productId = req.params.pid
    // Buscar el carrito correspondiente en el arreglo de carritos
    const cart = carts.find(c => c.id === parseInt(cartId))
    // Si el carrito no existe, responder con un mensaje de error
    if (!cart) {
        res.status(404).send('Cart not found');
        return
    }
    // Buscar el producto correspondiente en el arreglo de productos
    const productIndex = products.findIndex(p => p.id === parseInt(productId))
    if (productIndex === -1) {
        // Si el producto no existe, responder con un mensaje de error
        res.status(404).send('Product not found')
        return
    }
    products[productIndex].quantity--
    // Buscar el producto correspondiente en el arreglo de productos del carrito
    const existingProduct = cart.products.find(p => p.product === parseInt(productId))
    if (existingProduct) {
        // Si el producto ya existe en el carrito, incrementar la cantidad
        existingProduct.quantity++
    } else {
        // Si el producto no existe en el carrito, agregarlo al arreglo de productos
        cart.products.push({ product: parseInt(productId), quantity: 1 })
    }
    // Responder con el carrito actualizado
    res.send(cart)
    fs.writeFile('../products.json', JSON.stringify(products), function(err) {
        if (err) {
            res.status(404).json(err)
        }
        console.log('products.json has been updated')
    })
    exportCartsToJSON('carts.json')
});

module.exports = router
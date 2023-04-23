const { Router } = require('express')
const fs = require('fs')
const path = require('path')

const router = Router()
// Array vacio inicial
let products = []

// Funcion para exportar los cambios de productos al archivo JSON
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

// Listado de productos (con parametro de limite en el URL)
router.get('/', (req, res) => {
    // Recibir el limit del URL como numero 
    const limit = parseInt(req.query.limit)

    // Si no existe, enviar el array completo. Si existe el limite, cortar el array hasta el limite y enviarlo
    if (!limit) {
        return res.send({products})
    } else {
        productsLimit = products.slice(0, limit)
        return res.send(productsLimit)
    }
})

// Filtrado de productos por ID
router.get('/:pid', (req, res) => {
    // Recibir el ID del producto del URL como numero
    const productId = parseInt(req.params.pid)

    // Buscar el ID recibido en el array
    const product = products.find( product => product.id === productId )

    // Si no existe el producto enviar un error
    if (!product) {
        const error = { error: "Product not found" }
        return res.status(404).send(error)
    }

    // Si el producto existe, enviarlo
    res.send(product)
})

// Generar productos
router.post('/', (req, res) => {
    // Defino las propiedades que tienen que tener los productos que reciba de Postman
    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    // Validacion de que todas las propiedades obligatorias hayan sido enviadas, si falta alguna se envia mensaje de error
    if ( !title || !description || !code || !price || !status || !stock || !category ) {
        return res.status(400).send( "Incomplete data. Complete all data before submitting" )
    }

    // // Validacion de que no se generen dos veces el mismo producto, si lo hace enviar error
    if (products.find(product => product.code === code)) {
        return res.status(400).send("Product already loaded")
    }
    
    // En caso de recibir todas las propiedades generar el producto con los datos enviados
    const newProduct = { id: products.length + 1, title, description, code, price, status, stock, category, thumbnails }

    // Pushear el nuevo producto al array de productos
    products.push(newProduct)

    // Mostrar en consola el nuevo producto para revisar los datos enviados
    console.log(newProduct)

    // Enviar mensaje de exito
    res.send( { status: "Product successfully loaded" } )

    // Generar el archivo JSON con el nuevo producto
    exportProductsJSON('../data/products.json')
})

// Actualizar datos del producto
router.put('/:pid', (req, res) => {
    // Recibir el ID del producto del URL como numero y buscarlo en el array de productos
    const product = products.find( p => p.id === parseInt(req.params.pid))

    // Verificar que el producto exista, si no existe enviar mensaje de error
    if (!product) {
        return res.status(404).send("Product not found")
    }

    // Actualizar las propiedades del producto solicitado, en caso de no modificar todos las propiedades actualizar solo las enviadas en la solicitud.
    product.title = req.body.title || product.title
    product.description = req.body.description || product.description
    product.code = req.body.code || product.code
    product.price = req.body.price || product.price
    product.status = req.body.status || product.status
    product.stock = req.body.stock || product.stock
    product.category = req.body.category || product.category
    product.thumbnails = req.body.thumbnails || product.thumbnails

    // Actualizar el archivo JSON con los obejtos actualizados
    exportProductsJSON('../data/products.json')
    return res.send({message: "The JSON archive has been successfuly updated"})
})

// Eliminar productos del array
router.delete("/:pid", (req, res) => {
    // Recibir el ID del producto del URL como numero y buscarlo en el array de productos
    const product = products.find( p => p.id === parseInt(req.params.pid))

    // Verificar que el producto exista, si no existe enviar mensaje de error
    if (!product) {
        return res.status(404).send("Product not found")
    }

    // Modificar el array eliminando el producto solicitado en la URL
    products = products.filter( product => product.id != parseInt(req.params.pid) )

    //Enviar mensaje de productos eliminados
    res.send( { status: "Products successfully deleted" } )

    // Actualizar el archivo JSON con el array actualizado
    exportProductsJSON('../data/products.json')
    return res.send({message: "The JSON archive has been successfuly updated"})
})

module.exports = router
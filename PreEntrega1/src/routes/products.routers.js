import { Router } from "express"
import fs from 'fs'

const router = Router()
const products = []

// Exportar productos a JSON
const exportProductsToJSON = (fileName) => {
    const productsJSON = JSON.stringify(products)
    const filePath= 'products.json'
    fs.truncate(filePath, 0, () => {
        fs.writeFile(filePath, productsJSON, (err) => {
            if (err) {
                throw new Error (`error writing file ${err}`)
            } else {
                console.log(`Products have been successfully added to the file ${fileName}`)
            }
        })
    })
}


// Listado de todos los productos
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit)
    if (!limit) {
        // Si no hay limite, enviar array completo
        return res.send({products})
    } else {
        // Si hay limite, cortar array hasta el limite y enviarlo 
        productsLimit = products.slice(0, limit)
        return res.send(productsLimit)
    }
})

// Productos por ID
router.get('/:pid', (req, res) => {
    // Recibir ID del producto
    const productsId = parseInt(req.params.pid)

    // Buscar el ID en el array
    const product = products.find(product => product.id === productsId)
    if (!product) {
        // Si  no existe el producto, enviar error
        const error = {error: 'Product not found'}
        return res.status(404).send(error)
    }
    // Si existe el producto, mostrar el producto con el ID especifico
    res.send(product)
})

//  Generar productos en Postman
router.post('/', (req, res) => {
    // Propiedades del producto a recibir de Postman
    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    // Validar de que todas las propiedades obligatorias sean enviadas 
    if ( !title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).send('Complete all data before sending')
    }
    // En caso de tener todo en orden, enviar producto al array dentro del archivo JSON
    const newProduct = {
        id: products.length + 1,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }
    products.push(newProduct)
    console.log(newProduct)
    res.send({status: "success"})
    console.log('product successfully added')
    exportProductsToJSON('products.json')
})

// Actualizar productos
router.put('/:pid', (req, res) => {
    // Recibir el ID del producto a modificar
    const 

    // Modificar valor de un objeto 
    res.status(200).send({ status: " success", message: "product successfully updated"})

    // Enviar modificacion al archivo JSON
    const productsJSON = JSON.stringify(products)
    fs.writeFile('products.json', productsJSON, (err) => {
        if (err) {
            return res.status(500).send({ error: `error writing file ${err}`})
        } else {
            return res.status(200).send(products)
        }
    })
})


export default router
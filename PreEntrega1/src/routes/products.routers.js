import { Router } from "express"
import fs from 'fs'

const router = Router()
const products = []
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
        return res.send({products})
    } else {
        productsLimit = products.slice(0, limit)
        return res.send(productsLimit)
    }
})

// Productos por ID
router.get('/products/:pid', (req, res) => {
    const productsId = parseInt(req.params.pid)
    const product = products.find(product => product.id === productsId)
    if (!product) {
        const error = {error: 'Product not found'}
        return res.status(404).send(error)
    }
    res.send(product)
})

//  Generar productos en Postman
router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    if ( !title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).send('Complete all data before sending')
    }
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

export default router
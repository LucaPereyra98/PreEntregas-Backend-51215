const { Router } = require('express')
const ProductManager = require('../Managers/productManager')

const products = new ProductManager()
const path = 'products'
const router = Router()

// Endpoint GET 
router.get(`/${path}`, async (req, res) => {
    try {
        const resProducts = await products.getAllProducts()
        res.status(200).json(resProducts)
    } catch (error) {
        console.error(error)
    }
})

// Endpoint GET por Id
router.get(`/${path}/:id`, async (req, res) => {
    const { id } = req.params
    try {
        const resProduct = await products.getProductById(parseInt(id))
        res.status(200).json(resProduct)
    } catch (error) {
        console.log(error)
    }
});

// Endpoint POST 
router.post(`/${path}`, async (req, res) => {
    const body = req.body
    try {
        const resProducts = await products.addProduct(body)
        res.status(200).json(resProducts)
    } catch (error) {
        console.log(error)
    }
});

// Endpoint PUT
router.put(`/${path}/:id`, async (req, res) => {
    const { id } = req.params
    const body = req.body
    try {
        const resProducts = await products.updateProduct(parseInt(id), body)
        res.status(200).json(resProducts)
    } catch (error) {
        console.log(error)
    }
});

// Endpoint DELETE
router.delete(`/${path}/:id`, async (req, res) => {
    const { id } = req.params
    try {
        const resProduct = await products.deleteProduct(parseInt(id))
        res.status(200).json(resProduct)
    } catch (error) {
        console.log(error)
    }
});

module.exports = router
const fs = require('fs')

// Clase Product Manager
class ProductManager {
    constructor () {
        this.path = __dirname + './data/products.json'
    }

    // Obtener todos los productos
    async getAllProducts() {
        productsJSON = await fs.promises.readFile(this.path, 'utf-8')
        if (!productsJSON.trim()) {
            return []
        }
        const productsParse = JSON.parse(productsJSON)
        return productsParse
    }

    // Obtener el producto por Id
    async getProductsById(id) {
        const products = await this.getAllProducts()
        const product = products.find( (product) => product.id === id)
        if (!product) {
            return `Product searched with id ${id} was not found`
        }
        return product
    }

    // Añadir productos al carrito
    async addProduct(product) {
        const { title, price, description, stock, code, category } = product
        const products = await this.getAllProducts()
        const newProduct = {
            id: Date.now(),
            title,
            price,
            description,
            thumbnail: [],
            status: true,
            stock,
            code,
            category
        }
        const checkProductInfo = Object.values(newProduct).includes(undefined)
        if (checkProductInfo) {
            return "The product lacks properties"
        }
        products.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return products
    }

    // Actualizar producto
    async updateProduct(id, data) {
        const products = await this.getAllProducts()
        const productIndex = products.findIndex((product) => product.id === id )
        if (productIndex === -1) {
            return `Product searched with id ${id} was not found`
        }
        products[productIndex] = {
            ...products[productIndex], ...data,
        }
        const checkProductInfo = Object.values(products[productIndex]).includes(undefined)
        if (checkProductInfo) {
            return `The product lacks properties`
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return products
    }

    // Eliminar un producto
    async deleteProduct(id) {
        const products = await this.getAllProducts()
        const product = products.find( (product) => product.id === id )
        if (!product) {
            return `Product searched with id ${id} was not found`
        }
        const productsFilter = products.filter( (product) => product.id !== id )
        await fs.promises.writeFile(this.path, JSON.stringify(productsFilter) )
        return productsFilter
    }
}

module.exports = ProductManager
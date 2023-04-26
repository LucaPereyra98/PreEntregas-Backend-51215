const fs = require('fs')
const ProductManager = require('./productManager')

class CartManager {

    productsManager = new ProductManager()

    constructor() {
        this.path = __dirname + './data/carts.json'
    }

    // Mostrar todos los carritos
    async getAllCarts() {
        const cartsJSON = await fs.promises.readFile(this.path, 'utf-8')
        if (!cartsJSON.trim()) {
            return []
        }
        const cartsParse = JSON.parse(cartsJSON)
        return cartsParse
    }

    // Mostrar el carrito por Id
    async getCartById() {
        const carts = await this.getAllCarts()
        console.log(carts)
        const newCart = { id: Date.now(), products: [] }
        carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return carts
    }

    // Agregar un producto al carrito
    async addProductToCart(idCart, idProduct) {
        const carts = await this.getAllCarts()
        const product = await this.productsManager.getProductById(idProduct)
        if (!product) {
            return `Product searched with id ${id} was not found`
        }
        const cartIndex = carts.findIndex(cart => cart.id === idCart)
        if (cartIndex === -1) {
            return `Cart searched with id ${id} was not found`
        }
        carts[cartIndex].products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return carts
    }

    // Borrar carrito segun Id
    async deleteCart(id) {
        const carts = await this.getAllCarts()
        carts.filter( (cart) => cart.id !== id )
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return carts
    }
}

module.exports = CartManager
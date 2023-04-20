import { Router } from "express";
import fs from "fs"

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

// Agregar productos al carrito de compras
router.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params
    
    // Verificar si existe el carrito
    const cart = carts.find((cart) => cart.id === parseInt(cid))
    if (!cart) {
        // Si el carrito no existe, enviar error
        res.status(404).json({ error: "Cart not found"})
    }

    // Actualizar archivo JSON
    const cartsJSON = JSON.stringify(carts)
    fs.writeFile('carts.json', cartsJSON, (err) => {
        if (err) {
            return res.status(500).send({ error: `error writing file ${err}`})
        } else {
            return res.status(200).json({ status: "success", message: "Cart upgraded" })
        }
    })
})

export default router
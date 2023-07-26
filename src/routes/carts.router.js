import exp from "constants";
import { Router } from "express";
import fs from 'fs'
const router = Router()
router.post("/",(req,res)=> {
    const carts = JSON.parse(fs.readFileSync("./carts.json","utf8"))
    const cart = {}
    const products = []
    cart.id = carts.length
    cart.products = products
    carts.push(cart)
    fs.writeFileSync("./carts.json",JSON.stringify(carts,null,2))
    res.send({status:"SUCCES",msg:"Carrito creado correctamente"})
})
router.get("/:id",(req,res)=> {
    const carts = JSON.parse(fs.readFileSync("./carts.json","utf8"))
    const products = JSON.parse(fs.readFileSync("./products.json","utf8"))
    let id = parseInt(req.params.id)
    const cartId = carts.findIndex(i => i.id == id)
    if (cartId == -1) {
        return res.status(202).send({status:"ERROR",msg:"Carrito no encontrado"})
    }
    const productsInCart = []
    for (let i = 0;i<carts[id].products.length;i++) {
        for (let f = 0;f<products.length;f++) {
            if (carts[id].products[i].product == products[f].id) {
                productsInCart.push(products[f])
            }
        }
    }
    res.send(productsInCart)
})
router.post("/:id/product/:pid",(req,res)=> {
    const products = JSON.parse(fs.readFileSync("./products.json","utf8"))
    const quantity = parseInt(req.body.quantity)
    console.log(quantity)
    if (!quantity) {
        return res.status(400).send({status:"ERROR",msg:"Falta el quantity"})
    }
    const carts = JSON.parse(fs.readFileSync("./carts.json","utf8"))
    const cartId = carts.findIndex(i=>i.id == parseInt(req.params.id))
    if(cartId == -1) {
        return res.status(202).send({status : "ERROR", msg: "Cart no encotnrado"})
    }
    const productId = products.findIndex(i=>i.id == parseInt(req.params.pid))
    if(productId == -1) {
        return res.status(202).send({status : "ERROR", msg: "Producto no encotnrado"})
    }
    const productIdInCart = carts[cartId].products.findIndex(i=>i.product == productId)
    if (productIdInCart == -1) {
        carts[cartId].products.push({
            product : parseInt(req.params.pid),
            quantity : quantity
        })
    } else {
        carts[cartId].products[productIdInCart].quantity +=quantity
    }
    fs.writeFileSync("./carts.json",JSON.stringify(carts,null,2))
    res.send({status:"SUCCES",msg:"Product agregado al carrito",data: carts[cartId]})
})
export default router
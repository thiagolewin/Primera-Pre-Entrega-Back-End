import { Router, json } from "express";
import { uploader } from "../utils.js";
const router = Router()
import fs from "fs"
router.get("/",(req,res)=> {
    const limit = parseInt(req.query.limit)
    const products = JSON.parse(fs.readFileSync("./products.json","utf8"))
    if (isNaN(limit)) {
        res.send(products)
    } else {
        res.send(products.slice(0,limit))
    }
})
router.get("/:id",(req,res)=> {
    const productId = parseInt(req.params.id)
    const products = JSON.parse(fs.readFileSync("./products.json","utf8"))
    let producto = products.find(i => i.id ===productId)
    res.send(producto)
})
router.post("/",uploader.single('file'),(req,res)=> {
    const products = JSON.parse(fs.readFileSync("./products.json","utf8"))
    if (!req.file) {
        return res.status(400).send({status:"ERROR",msg: "No se adjunto archivo"})
    }
    const product = req.body
    const {title,description,code,price,status,stock,category} = product
    let indexOfId = products.findIndex(i=>i.id == product.id)
    if (indexOfId !== -1) {
        return res.status(400).send({status:"ERROR",msg:"Id ya usado"})
    }
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).send({status:"ERROR",msg:"Faltan datos"})
    }
    product.id = products.length
    if(!product.thumbnails) {
        product.thumbnails = []
    }
    product.thumbnails.push(req.file.path)
    products.push(product)
    fs.writeFileSync("./products.json",JSON.stringify(products,null,2))
    res.send({status:"SUCCES",msg:"Product agregado",data:product})
})
router.put("/:id",uploader.single('file'),(req,res)=> {
    const products = JSON.parse(fs.readFileSync("./products.json","utf8"))
    const id = parseInt(req.params.id)
    const product = req.body
    const {title,description,code,price,status,stock,category} = product
    const productId = products.findIndex(i => i.id == id)
    if (productId == -1) {
        return res.status(202).send({status:"ERROR",msg:"No se encontro el producto por el id"})
    }
    if (!req.file) {
        return res.status(400).send({status:"ERROR",msg: "No se adjunto archivo"})
    }
    if (!title || !description || !code || !price || !status || !stock || !category) {
        return res.status(400).send({status:"ERROR",msg:"Faltan datos"})
    }
    if(!product.thumbnails) {
        product.thumbnails = []
    }
    product.id = products[productId].id
    product.thumbnails.push(req.file.path)
    products[productId] = product
    fs.writeFileSync("./products.json",JSON.stringify(products,null,2))
    res.send({status:"SUCCES",msg:"Producto actualizado correctamente"})
})
router.delete("/delete/:id",(req,res)=> {
    const products = JSON.parse(fs.readFileSync("./products.json","utf8"))
    const id = parseInt(req.params.id)
    const productid = products.findIndex(i=>i.id === id)
    if (productid == -1) {
        return res.status(202).send({status : "ERROR", msg: "Producto no encotnrado"})
    }
    products.splice(productid,1)
    fs.writeFileSync("./products.json",JSON.stringify(products,null,2))
    res.send({status:"SUCCES",msg:"Producto eliminado"})
})
export default router
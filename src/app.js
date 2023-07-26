import express from 'express'
import { uploader } from './utils.js'
import productRoutes from './routes/products.router.js'
import cartRoutes from './routes/carts.router.js'
const app = express()
const PORT = 8080
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/api/products',productRoutes)
app.use("/api/carts",cartRoutes)
app.listen(PORT,()=> {
    console.log("escuchando")
})
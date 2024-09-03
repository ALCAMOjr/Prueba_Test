import express from 'express'
import AuthRoutes from './routes/auth.routes.js'
import ProductsRoutes from './routes/products.routes.js'
import cors from "cors";
const app = express()


app.use(cors());
app.use(express.json())
app.use('/api', AuthRoutes)
app.use('/api', ProductsRoutes)


export { app };

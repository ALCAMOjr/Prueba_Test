import { Router } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductsBatch,
    updateProductsBatch,
    deleteProductsBatch
} from '../controllers/products.controller.js';
import Middleware from '../middleware/authMiddleware.js';

const router = Router();


router.get('/products', Middleware, getProducts);
router.get('/products/:id', Middleware, getProductById);
router.post('/products', Middleware, createProduct);
router.patch('/products/:id', Middleware, updateProduct);
router.delete('/products/:id', Middleware, deleteProduct);
router.post('/products/batch', Middleware, createProductsBatch);
router.patch('/products/update/batch', Middleware, updateProductsBatch);
router.delete('/products/delete/batch', Middleware, deleteProductsBatch);

export default router;

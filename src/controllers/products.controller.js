import { pool } from '../db.js';
import Joi from 'joi';

// Esquema de validación para el producto usando JOI
const productSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(5).required(),
    height: Joi.number().positive().required(),
    length: Joi.number().positive().required(),
    width: Joi.number().positive().required(),
});

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const { userId } = req;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        const [rows] = await pool.query('SELECT * FROM catalog_products');
        res.json(rows);
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while getting the products' });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const { userId } = req;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        const id = req.params.id;
        const [rows] = await pool.query('SELECT * FROM catalog_products WHERE id = ?', [id]);

        if (rows.length <= 0) return res.status(404).json({ message: 'Product not found' });

        res.json(rows[0]);
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while getting the product by id' });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { userId } = req;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        
        const { error, value } = productSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { name, description, height, length, width } = value;

        const [result] = await pool.query(
            'INSERT INTO catalog_products (name, description, height, length, width) VALUES (?, ?, ?, ?, ?)', 
            [name, description, height, length, width]
        );
        
        res.status(201).json({ id: result.insertId, name, description, height, length, width });
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while creating the product' });
    }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
    try {
        const { userId } = req;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        const id = req.params.id;

        const { error, value } = productSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { name, description, height, length, width } = value;

        const [result] = await pool.query(
            'UPDATE catalog_products SET name = ?, description = ?, height = ?, length = ?, width = ? WHERE id = ?', 
            [name, description, height, length, width, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });

        res.json({ id, name, description, height, length, width });
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while updating the product' });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const { userId } = req;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        const id = req.params.id;
        const [result] = await pool.query('DELETE FROM catalog_products WHERE id = ?', [id]);

        if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });

        res.sendStatus(204);
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while deleting the product' });
    }
};

// Crear múltiples productos
export const createProductsBatch = async (req, res) => {
    try {
        const { userId } = req;
        const products = req.body;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        const results = {
            success: [],
            failed: [],
        };

        for (const product of products) {
            const { error } = productSchema.validate(product);
            if (error) {
                results.failed.push({ product, error: error.details[0].message });
                continue;  
            }

            const { name, description, height, length, width } = product;

            try {
                const [result] = await pool.query(
                    'INSERT INTO catalog_products (name, description, height, length, width) VALUES (?, ?, ?, ?, ?)',
                    [name, description, height, length, width]
                );
                results.success.push({ id: result.insertId, name, description, height, length, width });
            } catch (dbError) {
                results.failed.push({ product, error: dbError.message });
            }
        }

        res.status(207).json({ message: 'Batch process completed', results });  
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while creating the products' });
    }
};

// Actualizar múltiples productos
export const updateProductsBatch = async (req, res) => {
    try {
        const { userId } = req;
        const products = req.body;


        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }
        const results = {
            success: [],
            failed: [],
        };

       
        for (const product of products) {
            const { id, name, description, height, length, width } = product;
            const { error } = productSchema.validate({ name, description, height, length, width });

            if (error) {
                results.failed.push({ product, error: error.details[0].message });
                continue;  
            }

            try {
                const [result] = await pool.query(
                    'UPDATE catalog_products SET name = ?, description = ?, height = ?, length = ?, width = ? WHERE id = ?',
                    [name, description, height, length, width, id]
                );

                if (result.affectedRows === 0) {
                    results.failed.push({ product, error: `Product with id ${id} not found` });
                } else {
                    results.success.push({ id, name, description, height, length, width });
                }
            } catch (dbError) {
                results.failed.push({ product, error: dbError.message });
            }
        }

        res.status(207).json({ message: 'Batch process completed', results });  
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while updating the products' });
    }
};

// Eliminar múltiples productos
export const deleteProductsBatch = async (req, res) => {
    try {
        const { userId } = req;
        const ids = req.body.ids;

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (users.length <= 0) {
            return res.status(400).send({ error: 'Invalid user id' });
        }

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).send({ error: 'No product ids provided' });
        }

        const results = {
            success: [],
            failed: [],
        };

        for (const id of ids) {
            try {
                const [result] = await pool.query('DELETE FROM catalog_products WHERE id = ?', [id]);

                if (result.affectedRows === 0) {
                    results.failed.push({ id, error: `Product with id ${id} not found` });
                } else {
                    results.success.push({ id });
                }
            } catch (dbError) {
                results.failed.push({ id, error: dbError.message });
            }
        }

        res.status(207).json({ message: 'Batch process completed', results });  
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'An error occurred while deleting the products' });
    }
};

import jsonwebtoken from 'jsonwebtoken';
import { pool } from "../db.js";
import Joi from 'joi';

// Definir esquema de validación para el login usando Joi
const loginSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(), 
});

// Definir esquema de validación para el registro usando Joi
const signupSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    img_profile: Joi.string().uri().optional() 
});

// Funcion para autenticar usuarios.
export const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }
        const { name } = req.body;
        const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);

        if (rows.length === 0) {
            return res.status(400).send({ error: 'Name not found' });
        }
        const user = rows[0];
        const userForToken = {
            id: user.id,
            name: user.name
        };
        const token = jsonwebtoken.sign(
            userForToken,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION } 
        );
        res.status(200).send({ status: "ok", message: "Logged in successfully", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred during login' });
    }
};



// Funcion para registrar usuarios.
export const signup = async (req, res) => {
    try {
        const { error } = signupSchema.validate(req.body);

        if (error) {
            return res.status(400).send({ error: error.details[0].message });
        }

        const { name, img_profile } = req.body;
        const [existingUser] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
        if (existingUser.length > 0) {
            return res.status(400).send({ error: 'User already exists' });
        }

        const [result] = await pool.query(
            'INSERT INTO users (name, img_profile) VALUES (?, ?)', 
            [name, img_profile]
        );

        res.status(201).send({ status: "ok", message: "User created successfully", userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred during signup' });
    }
};
# Proyecto Prueba_Test

Este proyecto es una API que gestiona usuarios y productos, utilizando Node.js con Express.js y una base de datos MySQL.

* **Node.js 16 o superior**
  * Instalalo desde [Node.js official website](https://nodejs.org/)

### Instrucciones de Configuración 🔧

1. Clona el repositorio 
```
git clone https://github.com/ALCAMOjr/Prueba_Test.git
```

2. Navega al directorio
```
cd Prueba_Test
```
3. Instala dependencias:
```
npm install
```
4. Configurar Variables de Entorno en el archivo .env:
```
JWT_SECRET=<tu_secreto_jwt>
JWT_EXPIRATION=1h
DATABASE=<tu_base_de_datos>
DB_PORT=<tu_puerto_de_base_de_datos>
HOST_DATABASE=<tu_host_de_base_de_datos>
PASSWORD_DATABASE=<tu_contraseña_de_base_de_datos>
USER_DATABASE=<tu_usuario_de_base_de_datos>
PORT=7000
```
## Base de Datos📦
_Crea la base de Datos:_
```
CREATE DATABASE Prueba;

USE Prueba;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    img_profile VARCHAR(255)
);

CREATE TABLE catalog_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    height DECIMAL(10, 2),
    length DECIMAL(10, 2),
    width DECIMAL(10, 2)
);

CREATE TABLE access_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    token VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

```

## Deploya el proyecto📦
_Ejecuta el comando:_
```
npm run dev

```

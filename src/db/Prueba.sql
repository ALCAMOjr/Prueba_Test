create DATABASE Prueba;

use Prueba;

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

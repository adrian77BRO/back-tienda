const conexion = require('../database');
const config = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registro = (req, res) => {
    const { id_usuario, username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Formato de email inválido'
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'La contraseña debe contener al menos 6 caracteres, una letra mayúscula y un número'
        });
    }

    conexion.query('SELECT * FROM usuario WHERE id_usuario = ? OR email = ?', [id_usuario, email], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al consultar',
                error: error.message
            });
        }
        if (result.length > 0) {
            return res.status(404).json({
                message: 'El correo electrónico ya existe'
            });
        } else {
            const encriptado = bcrypt.hashSync(password, 10)
            conexion.query(`INSERT INTO usuario (username, email, password) VALUES
            (?,?,'${encriptado}')`, [username, email, password], (error) => {
                if (error) {
                    return res.status(500).json({
                        message: 'Error al registrarse',
                        error: error.message
                    });
                }
                return res.status(200).json({
                    message: 'Ha sido registrado exitosamente',
                });
            });
        }
    });
}

const login = (req, res) => {
    const { email, password } = req.body;
    conexion.query('SELECT * FROM usuario WHERE email = ?', [email], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al iniciar sesión',
                error: error.message
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: 'Email incorrecto'
            });
        }

        const encontrado = result[0];
        const correcto = bcrypt.compareSync(password, encontrado.password);

        if (!correcto) {
            return res.status(404).json({
                message: 'Contraseña incorrecta'
            })
        } else {
            const payload = {
                user: {
                    id: encontrado.id_usuario
                }
            };
            const token = jwt.sign(payload, config.token.secret, { expiresIn: '1h' });

            return res.status(200).json({
                message: 'Acceso exitoso',
                usuario: encontrado.id_usuario,
                token
            })
        }
    });
}

module.exports = {
    registro,
    login
}
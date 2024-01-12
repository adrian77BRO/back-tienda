const jwt = require('jsonwebtoken');
const config = require('../config');

function verificarToken(req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            message: 'Acceso denegado'
        });
    }

    try {
        const decoded = jwt.verify(token, config.token.secret);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido'
        });
    }
}

module.exports = { verificarToken }
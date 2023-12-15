const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.post('/', usuariosController.registro);
router.post('/login', usuariosController.login);
// router.patch('/:id', usuariosController.cambiarPassword);

module.exports = router;
const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categorias.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', verificarToken, categoriasController.obtenerCategorias);
router.get('/:id', verificarToken, categoriasController.consultarCategoria);
router.post('/', verificarToken, categoriasController.agregarCategoria);
router.delete('/:id', verificarToken, categoriasController.eliminarCategoria);
router.put('/:id', verificarToken, categoriasController.editarCategoria);

module.exports = router;
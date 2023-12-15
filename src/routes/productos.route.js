const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', productosController.obtenerProductos);
router.get('/:id', verificarToken, productosController.consultarProducto);
router.post('/', verificarToken, productosController.agregarProducto);
router.delete('/:id', verificarToken, productosController.eliminarProducto);
router.put('/:id', verificarToken, productosController.editarProducto);

module.exports = router;
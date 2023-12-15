const express = require('express');
const app = express();
const config = require('./config');
const cors = require('cors');
require('./database');

const usuariosRouter = require('./routes/usuarios.route');
const productosRouter = require('./routes/productos.route');
const categoriasRouter = require('./routes/categorias.route');

app.set('port', config.app.port);
app.use(express.json());
app.use(cors());

app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/categorias', categoriasRouter);

module.exports = app;
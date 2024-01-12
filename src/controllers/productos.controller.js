const conexion = require('../database');

const obtenerProductos = (req, res) => {
    const { page, limit } = req.query;

    let consulta = `SELECT p.id_producto, p.nombre, p.descripcion, p.marca, c.nombre categoria, p.cantidad, p.precio_venta,
    p.precio_compra, p.imagen FROM producto p JOIN categoria c WHERE p.id_categoria = c.id_categoria AND p.deleted = 0`;

    if (page && limit) {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        consulta += `LIMIT ${limit} OFFSET ${offset}`;
    }

    conexion.query(consulta, (error, productos) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al obtener los productos',
                error: error.message
            });
        }
        return res.status(200).json(productos);
    });
}

const consultarProducto = (req, res) => {
    const id_producto = req.params.id;
    conexion.query(`SELECT p.nombre, p.descripcion, p.marca, c.nombre categoria, p.cantidad, p.precio_venta, p.precio_compra, p.imagen
    FROM producto p JOIN categoria c WHERE p.id_categoria = c.id_categoria AND p.id_producto = ? AND p.deleted = 0`,
        [id_producto], (error, producto) => {
            if (error) {
                return res.status(500).json({
                    message: 'Error al consultar el producto',
                    error: error.message
                });
            }
            if (producto.length > 0) {
                return res.status(200).json(producto);
            } else {
                return res.status(404).json({
                    message: 'Producto no encontrado'
                });
            }
        });
}

const agregarProducto = (req, res) => {
    const { nombre, descripcion, marca, id_categoria, cantidad, precio_venta, precio_compra, imagen } = req.body;
    conexion.query(`INSERT INTO producto (nombre, descripcion, marca, id_categoria, cantidad, precio_venta, precio_compra, imagen,
    created_at, created_by, deleted) VALUES (?,?,?,?,?,?,?,?,now(),${req.user.id},0)`, [nombre, descripcion, marca, id_categoria,
        cantidad, precio_venta, precio_compra, imagen], (error) => {
            if (error) {
                return res.status(500).json({
                    message: 'Error al agregar el producto',
                    error: error.message
                });
            }
            return res.status(200).json({
                message: 'Producto agregado exitosamente',
            });
        });
}

const eliminarProducto = (req, res) => {
    const id_producto = req.params.id;
    conexion.query(`UPDATE producto SET deleted_at = now(), deleted_by = ${req.user.id}, deleted = 1
    WHERE id_producto = ?`, [id_producto], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al eliminar el producto',
                error: error.message
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Producto no encontrado'
            });
        } else {
            return res.status(200).json({
                message: 'Producto eliminado exitosamente'
            });
        }
    });
}

const editarProducto = (req, res) => {
    const id_producto = req.params.id;
    const { nombre, descripcion, marca, id_categoria, cantidad, precio_venta, precio_compra, imagen } = req.body;
    conexion.query(`UPDATE producto SET nombre = ?, descripcion = ?, marca = ?, id_categoria = ?, cantidad = ?,
    precio_venta = ?, precio_compra = ?, imagen= ?, updated_at = now(), updated_by = ${req.user.id} WHERE id_producto = ?`,
        [nombre, descripcion, marca, id_categoria, cantidad, precio_venta, precio_compra, imagen, id_producto], (error, result) => {
            if (error) {
                return res.status(500).json({
                    message: 'Error al editar el producto',
                    error: error.message
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Producto no encontrado'
                });
            } else {
                return res.status(200).json({
                    message: 'Producto editado exitosamente'
                });
            }
        });
}

module.exports = {
    obtenerProductos,
    consultarProducto,
    agregarProducto,
    eliminarProducto,
    editarProducto
}
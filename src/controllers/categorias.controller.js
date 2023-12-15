const conexion = require('../database');

const obtenerCategorias = (req, res) => {
    const { page, limit } = req.query;

    let consulta = 'SELECT * FROM categoria WHERE deleted = 0';

    if (page && limit) {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        consulta += `LIMIT ${limit} OFFSET ${offset}`;
    }

    conexion.query(consulta, (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al obtener las categorías',
                error: error.message
            });
        }
        return res.status(200).json({
            message: 'Todas las categorías:',
            categorias: result
        });
    });
}

const consultarCategoria = (req, res) => {
    const id_categoria = req.params.id;
    conexion.query('SELECT * FROM categoria WHERE id_categoria = ? AND deleted = 0', [id_categoria], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al consultar la categoría',
                error: error.message
            });
        }
        if (result.length > 0) {
            return res.status(200).json({
                categoria: result
            });
        } else {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }
    });
}

const agregarCategoria = (req, res) => {
    const { nombre, descripcion } = req.body;
    conexion.query(`INSERT INTO categoria (nombre, descripcion, created_at, created_by, deleted) VALUES
    (?,?,now(),${req.user.id},0)`, [nombre, descripcion], (error) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al agregar la categoría',
                error: error.message
            });
        }
        return res.status(200).json({
            message: 'Categoría agregada exitosamente',
        });
    });
}

const eliminarCategoria = (req, res) => {
    const id_categoria = req.params.id;
    conexion.query(`UPDATE categoria SET deleted_at = now(), deleted_by = ${req.user.id}, deleted = 1
    WHERE id_categoria = ?`, [id_categoria], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al eliminar la categoría',
                error: error.message
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        } else {
            return res.status(200).json({
                message: 'Categoría eliminada exitosamente'
            });
        }
    });
}

const editarCategoria = (req, res) => {
    const id_categoria = req.params.id;
    const { nombre, descripcion } = req.body;
    conexion.query(`UPDATE categoria SET nombre = ?, descripcion = ?, updated_at = now(), updated_by = ${req.user.id}
    WHERE id_categoria = ?`, [nombre, descripcion, id_categoria], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: 'Error al editar la categoría',
                error: error.message
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        } else {
            return res.status(200).json({
                message: 'Categoría editada exitosamente'
            });
        }
    });
}

module.exports = {
    obtenerCategorias,
    consultarCategoria,
    agregarCategoria,
    eliminarCategoria,
    editarCategoria
}
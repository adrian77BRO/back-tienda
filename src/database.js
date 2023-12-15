const mysql = require('mysql');
const config = require('./config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

const conexion = mysql.createConnection(dbconfig);

conexion.connect((error) => {
    if (error) {
        console.log('Error al conectar la base de datos', error);
    } else {
        console.log('BD conectada exitosamente');
    }
})

module.exports = conexion;
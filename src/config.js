require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT
    },
    mysql: {
        host: process.env.HOST || 'localhost',
        user: process.env.USER || 'root',
        password: process.env.PASSWORD,
        database: process.env.DB
    },
    token: {
        secret: process.env.SECRET
    }
}
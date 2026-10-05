const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pyquest_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function checkDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ [MySQL] Conexão com o banco "pyquest_db" estabelecida com sucesso via XAMPP!');
        connection.release();
        return true;
    } catch (error) {
        console.warn('⚠️ [MySQL] Não foi possível conectar ao MySQL na porta 3306.');
        console.warn('💡 Verifique se o módulo MySQL está iniciado no XAMPP Control Panel.');
        console.warn('Detalhes do erro:', error.message);
        return false;
    }
}

module.exports = {
    pool,
    checkDatabaseConnection
};

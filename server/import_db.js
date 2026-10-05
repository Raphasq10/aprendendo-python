const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

async function importarBanco() {
    console.log('🔄 Conectando ao MySQL no XAMPP (127.0.0.1:3306)...');
    let connection;
    try {
        // Conecta sem especificar o database para criar se não existir
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        console.log('✅ Conexão inicial estabelecida!');
        const sqlPath = path.join(__dirname, '..', 'database_schema_mysql.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        console.log('📦 Executando script DDL e populando seeds do PyQuest...');
        await connection.query(sqlContent);

        console.log('🎉 [Sucesso] Banco `pyquest_db` e tabelas criados e populados com perfeição!');
        console.log('👉 Você também pode conferir tudo no phpMyAdmin em: http://localhost/phpmyadmin');
    } catch (err) {
        console.error('❌ Erro ao importar banco no MySQL:');
        console.error(err.message);
        console.log('\n💡 Dica: Certifique-se de que o botão "Start" do MySQL está verde no Painel de Controle do XAMPP.');
    } finally {
        if (connection) await connection.end();
    }
}

importarBanco();

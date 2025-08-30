// connection.js
import mysql from 'mysql2/promise';

class Connection {
    static #pool = null;

    static async initializePool() {
        if (!Connection.#pool) {
            Connection.#pool = mysql.createPool({
                host: process.env.DB_HOST || 'db4free.net',
                user: process.env.DB_USER || 'superxmen',
                password: process.env.DB_PASSWORD || 'minhagata',
                database: process.env.DB_NAME || 'lojaonline13',
                port: 3306,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            console.log('MySQL connection pool initialized');
        }
        return Connection.#pool;
    }

    static async getConnection() {
        if (!Connection.#pool) {
            await Connection.initializePool();
        }
        return Connection.#pool.getConnection();
    }
    static async getDbConnection() {
        if (!Connection.#pool) {
            await Connection.initializePool();
        }
        try {
            const connection = await Connection.#pool.getConnection();
            return connection;
        } catch (e) {
            console.error('Error getting connection from db4free.net pool:', e.message);
            throw new Error(`Database connection pool error for db4free.net: ${e.message}`);
        }
    }
}

// Add this line to export the class properly
export default Connection;
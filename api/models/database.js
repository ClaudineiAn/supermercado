// services/database.js
import Connection from './connection.js';

class Database {
    static async getAllItens() {
        let connection;
        try {
            connection = await Connection.getDbConnection();
            const [rows] = await connection.execute(`SELECT * FROM supermercado`);
            return rows.map(row => ({
                idsupermercado: row.idsupermercado,
                produto: row.produto,
                svg: row.svg,
                ativo: row.ativo
            }));
        } catch (error) {
            console.error("Error in getAllProjectsByUserId:", error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
    static async toggleActive(data) {
        let connection;
        try {
            connection = await Connection.getDbConnection();
            const [result] = await connection.execute(
                'UPDATE supermercado SET ativo=? WHERE idsupermercado=?',
                [data.active,data.super]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Error updating active:", error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
    static async new(data) {
        let connection;
        try {
            connection = await Connection.getDbConnection();
            await connection.execute(
                'INSERT INTO supermercado (produto, ativo) VALUES (?, ?)',
                [data.new,0]
            );
            return;
        } catch (error) {
            console.error("Error updating active:", error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
    static async delete(data) {
        let connection;
        try {
            connection = await Connection.getDbConnection();
            await connection.execute(
                'DELETE FROM supermercado WHERE idsupermercado=?',
                [data.item]
            );
            return;
        } catch (error) {
            console.error("Error updating active:", error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

export default Database
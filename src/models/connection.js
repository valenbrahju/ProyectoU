import sql from 'mssql'
import config from '../config';


const connectionString = {
    user : config.user,
    password : config.password,
    server : config.server,
    database : config.database,
    options: {
        trustServerCertificate: true
    }
};


export async function getConnection() {
    try {
        const conn = await sql.connect(connectionString);
        return conn;
    } catch (error) {
        console.error('Error de conexion en la BD:', error);
        throw error; 
    }
}

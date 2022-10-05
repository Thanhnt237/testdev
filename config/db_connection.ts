import * as mysql from 'mysql2';

let database_info = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE_NAME,
    multipleStatements: true,
    supportBigNumbers: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}


// // xử lý call back với await
const pool = mysql.createPool(database_info);
export const conn = pool.promise();


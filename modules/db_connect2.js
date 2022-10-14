// db_connect2.js
const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'practice',
    waitForConnections: true,
    connectionLimit: 5,  // 最大連線數
    queueLimit: 0 //不限制排隊數量
});
module.exports = pool.promise();  // 滙出promise pool

// createPool 可以不用一直連線斷線以增加效能
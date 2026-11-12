const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const { config } = require('../src/server');

let connection;
(async () => {
  connection = await mysql.createConnection({
    host: config.database.host, port: config.database.port,
    user: config.database.user, password: config.database.password,
    multipleStatements: true
  });
  const sql = fs.readFileSync(path.resolve(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  await connection.query(sql);
  console.log(`Đã khởi tạo database ${config.database.database}.`);
})().catch((error) => {
  console.error('Khởi tạo database thất bại:', error.message);
  process.exitCode = 1;
}).finally(async () => {
  if (connection) await connection.end().catch(() => {});
});

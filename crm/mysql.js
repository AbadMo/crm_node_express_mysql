const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys');

const conn = mysql.createPool(database);

conn.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has to many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  }

  if (connection) connection.release();
  console.log('DB is Connected');

  return;
});

// Promisify conn Querys
conn.query = promisify(conn.query);

module.exports = conn;
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'catalogopractica3'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a MySQL y la base de datos exitosamente.');
});

module.exports = connection;

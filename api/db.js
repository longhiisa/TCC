const mysql = require('mysql2');

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',        // seu usuário do MySQL
  password: 'suaSenha', // sua senha do MySQL
  database: 'escola'
});

module.exports = connection.promise(); // usando promessas para facilitar async/await

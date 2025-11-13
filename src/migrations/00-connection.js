var mysql = require('mysql2');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'projetoTWA_leavely'
});

function executeSQL(sqlQuery, callback) {
  con.query(sqlQuery, (err, results, fields) => {
    // Em vez de 'res.json()', chamamos o callback para retornar os resultados ou o erro quando a query for concluída
    callback(err, results);
  });
};

module.exports = { executeSQL };